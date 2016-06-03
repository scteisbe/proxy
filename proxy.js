var http = require('http'),
  httpProxy = require('http-proxy'),
  env = process.env,
  request = require('request');

var authcookies = "";
var loginposturl = 'http://scte.staging.coursestage.com/ext/coursestage/login/index.php';
var port = env.PORT || 8081;
var proxy = httpProxy.createProxyServer({});
var server = http.createServer(function(req, res) {

  console.log(' ----- ');
  console.log('URL: ' + req.url);
  if (req.url && req.url.charAt(0) != "/") {
    proxy.web(req, res, { target: req.url});
  } else {
    res.end("Proxy server is running on port " + port);
  }
});

proxy.on('proxyReq', function(proxyReq, req, res, options) {
  console.log("proxyReq");
  var proxycookies = proxyReq.getHeader("Cookie");
  // if (proxycookies) {
  if (0) {  // do something smarter here, but server doesn't like duplicate cookies
    proxycookies += "; " + authcookies;
  } else {
    proxycookies = authcookies;
  }

  proxyReq.setHeader('Cookie', proxycookies);
  // console.log("outbound headers:");
  // console.log(proxyReq.getHeader("Cookie"));
});

proxy.on('proxyRes', function (proxyRes, req, res) { 
  console.log("proxyRes");
});

proxy.on('error', function (err, req, res) {
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });

  console.log(JSON.stringify(err));
  res.end(JSON.stringify(err));
});

if (env.SCTE_PROXY_USERNAME && env.SCTE_PROXY_PASSWORD) {
  console.log("POSTing for cookie from " + loginposturl);
  var j = request.jar();
  request.post({
    url: loginposturl, 
    jar: j, 
    form: {username:env.SCTE_PROXY_USERNAME, password: env.SCTE_PROXY_PASSWORD, remote: '0', rememberusername: '1'}
    },
    function(err,httpResponse,body){
    var cookies = j.getCookies(loginposturl);
    if (cookies.length ==2) {
      authcookies = cookies[0].key + "=" + cookies[0].value
      authcookies += "; ";
      authcookies += cookies[1].key + "=" + cookies[1].value
      console.log("Got it. " + authcookies);
    } else {
      console.log ("Failed to get a cookie.");
    }
  })


  server.listen(port);
  console.log("listening on port " + port);
  console.log(env.HOST + ":" + port);
} else {
  console.log ("Bad creds from environment variables...");
  console.log ("SCTE_PROXY_USERNAME: " + env.SCTE_PROXY_USERNAME);
  console.log ("SCTE_PROXY_PASSWORD: " + env.SCTE_PROXY_PASSWORD);
}