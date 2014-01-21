#!/usr/bin/env node

var express = require("express"),
    modRw = require('connect-modrewrite'),
    app = express(),
    oneDay = 86400000;

app.use(modRw([
  '!png|jpg|jpeg|gif|css|js|html|ttf|pdf|svg|webp$ /index.html [L]'
]));

app.configure('development', function() {
  app.use('/styles', express["static"](__dirname + '/.tmp/styles'));
  app.use('/scripts', express["static"](__dirname + '/.tmp/scripts'));
  app.use(express["static"](__dirname + '/app'));
  app.use(express.compress());
  return app.use(express.logger());
});

app.configure('staging', function() {
  app.use(express["static"](__dirname + '/dist'));
  return app.use(express.compress());
});

app.configure('production', function() {
  app.use(express["static"](__dirname + '/dist'));
  return app.use(express.compress());
});

exports.startServer = function(port, path, callback) {
  var p = process.env.PORT || port;

  console.log("Starting server on port: " + p + ", path /" + path);

  app.listen(p);

  // If there's a callback then give them a return!
  if (callback != null) {
    return callback(app);
  }
};

// If `PORT` is sent, then it will auto-start the server.
if (process.env.PORT) {
  this.startServer(process.env.PORT, "dist");
}
