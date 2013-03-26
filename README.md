connect-metric
==============

Middleware that exposes [metric](https://github.com/CamShaft/metric-log) for logging in the context of a request

Usage
-----

```js
var app = express()
  , metric = require("connect-metric");

app.use(metric());

app.get("/", function(req, res){
  req.metric("home_page", 1, "views"); // measure=home_page val=1 units=views
});
```

Options
-------

```js
metric(context, options);
```

### context

The metric logger can inherit context

```js
app.use(metric({foo: "bar"}));

app.get("/", function(req, res){
  req.metric("home_page", 1, "views"); // foo=bar measure=home_page val=1 units=views
});
```

### options

#### options.request_id

Header name that provides a request id.
