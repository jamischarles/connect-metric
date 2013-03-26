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

  return function metricLogger(req, res, next) {

    var session = userSession(req.user)
      , data = {};

    if(req.headers[requestIDHeader]) data.request_id = req.headers[requestIDHeader]
    if(session) data.session = session;

    req.metric = metric.context(data).use(root);

    next();
  }
};

function userSession (user) {
  if(!user) return null;
  var hash = crypto.createHash('md5');
  hash.update(""+user.id || "");
  var time = new Date - 0;
  hash.update(""+(time - (time % TIME_DAY)));
  return hash.digest('hex');
}
