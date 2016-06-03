var http = require('http'),
  httpProxy = require('http-proxy'),
  env = process.env,
  request = require('request');

var authcookies = "";
var loginposturl = 'http://scte.staging.coursestage.com/ext/coursestage/login/index.php';
var proxy = httpProxy.createProxyServer({});
var server = http.createServer(function(req, res) {

  console.log(' ----- ');
  console.log('URL: ' + req.url);
  proxy.web(req, res, { target: req.url});
});

proxy.on('proxyReq', function(proxyReq, req, res, options) {
  var proxycookies = proxyReq.getHeader("Cookie");
  // if (proxycookies) {
  if (0) {  // do something smarter here, but server doesn't like duplicate cookies
  	proxycookies += "; " + authcookies;
  } else {
  	proxycookies = authcookies;
  }

  proxyReq.setHeader('Cookie', proxycookies);
  console.log("outbound headers:");
  console.log(proxyReq.getHeader("Cookie"));
});

proxy.on('proxyRes', function (proxyRes, req, res) {
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

  console.log("listening on port 8080");
  server.listen(8080);
} else {
  console.log ("Bad creds from environment variables...");
  console.log ("SCTE_PROXY_USERNAME: " + env.SCTE_PROXY_USERNAME);
  console.log ("SCTE_PROXY_PASSWORD: " + env.SCTE_PROXY_PASSWORD);
}