// var http = require('http') //,
// //    httpProxy = require('http-proxy');
// // var proxy = httpProxy.createProxyServer({});
// var server = http.createServer(function(req, res) {

//   console.log('Proxy on 8081 got:' + '\n' + JSON.stringify(req.headers, true, 2));
//   // proxy.web(req, res, { target: req.headers['x-forwarded-proto'] + '://' + req.headers.host || "http://cnet.com"});
// });
// console.log("listening on port 8081");
// server.listen(8081);



// http.createServer(function (req, res) {
//   console.log("requested url: " + req.url);
//   console.log('Port 8082 got:' + '\n' + JSON.stringify(req.headers, true, 2));
//   res.writeHead(200, { 'Content-Type': 'text/plain' });
//   res.write('You reached :8082!' + '\n' + JSON.stringify(req.headers, true, 2));
//   res.end();
// }).listen(8082);

//   console.log(`Application worker ${process.pid} started...`);




const http         = require('http'),
      fs           = require('fs'),
      path         = require('path'),
      contentTypes = require('./utils/content-types'),
      sysInfo      = require('./utils/sys-info'),
      env          = process.env;

let server = http.createServer(function (req, res) {
  let url = req.url;
  if (url == '/') {
    url += 'index.html';
  }

  // IMPORTANT: Your application HAS to respond to GET /health with status 200
  //            for OpenShift health monitoring

  if (url == '/health') {
    res.writeHead(200);
    res.end();
  } else if (url.indexOf('/info/') == 0) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store');
    res.end(JSON.stringify(sysInfo[url.slice(6)]()));
  } else {
    fs.readFile('./static' + url, function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end();
      } else {
        let ext = path.extname(url).slice(1);
        res.setHeader('Content-Type', contentTypes[ext]);
        if (ext === 'html') {
          res.setHeader('Cache-Control', 'no-cache, no-store');
        }
        res.end(data);
      }
    });
  }
});

server.listen(env.NODE_PORT || 3000, env.NODE_IP || 'localhost', function () {
  console.log(`Application worker ${process.pid} started...`);
});
