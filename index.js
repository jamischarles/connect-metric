/**
 * Module dependencies
 */
var metric = require("metric-log")
  , crypto = require('crypto');

/**
 * Defines
 */
var TIME_DAY = 60 * 60 * 24;

module.exports = function(context, options) {
  context = context || {};
  options = options || {};

  var requestIDHeader = options.request_id || 'x-request-id';

  var root = metric.context(context);

  return function metrics(req, res, next) {

    var session = userSession(req.user)
      , data = {};

    if(req.headers[requestIDHeader]) data.request_id = req.headers[requestIDHeader]
    if(session) data.session = session;

    req.metric = metric.context(data).use(root);

    next();
  }
};

function userSession (user) {
  if(!user || !user.id) return null;

  var hash = crypto.createHash('md5');
  // Create a session id by hashing the user.id
  hash.update(""+user.id);
  // And the day
  var time = (new Date - 0)/1000;
  hash.update(""+(time - (time % TIME_DAY)));
  // Formatted as hex
  return hash.digest('hex');
}
