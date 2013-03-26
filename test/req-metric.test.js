var should = require("should")
  , connect = require("connect")
  , request = require("supertest");

var app = connect();

app.use("/normal", require("..")());
app.use("/parent", require("..")({testing: 123}));

app.use("/user", function (req, res, next) {
  req.user = {
    id: "testing123"
  };
  next();
});
app.use("/user", require("..")());

app.use(function(req, res, next) {
  req.metric("response", 456);
  res.end();
});

describe("req-metric", function(){
  var log, str;

  beforeEach(function() {
    log = console.log;
    console.log = function(fmt) {
      str = fmt;
    };
  });

  afterEach(function() {
    console.log = log;
  });

  it("should print a metric in the context of a request", function(done) {
    request(app)
      .get("/normal")
      .set("x-request-id", "1234")
      .end(function(err, res) {
        if(err) done(err);
        str.should.match(/metric=response/);
        str.should.match(/request_id=1234/);
        str.should.match(/val=456/);
        str.should.not.match(/session=/);
        done();
      });
  });

  it("should print a metric inherited from the parent context", function(done) {
    request(app)
      .get("/parent")
      .set("x-request-id", "1235")
      .end(function(err, res) {
        if(err) done(err);
        str.should.match(/metric=response/);
        str.should.match(/request_id=1235/);
        str.should.match(/val=456/);
        str.should.match(/testing=123/);
        str.should.not.match(/session=/);
        done();
      });
  });

  it("should print a metric in the context of the user", function(done) {
    request(app)
      .get("/user")
      .set("x-request-id", "1236")
      .end(function(err, res) {
        if(err) done(err);
        str.should.match(/metric=response/);
        str.should.match(/request_id=1236/);
        str.should.match(/val=456/);
        str.should.match(/session=/);
        done();
      });
  });

});
