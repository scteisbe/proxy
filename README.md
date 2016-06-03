# Crawl proxy for SCTE mobile app

## Overview
A nodejs HTTP proxy that helps our SharePoint 2013 crawler get to password-protected WCW content.

## Usage

####Set up the basic environment
Install node and npm from here https://nodejs.org/en/

Install git here https://git-scm.com/download

####Get the code
```
git clone https://github.com/scteisbe/proxy.git <YOUR_TARGET_DIRECTORY_HERE>
cd <YOUR_TARGET_DIRECTORY_HERE>
```

####Install everything
```
npm install
npm install -g devtool  (prepend `sudo` on Mac)
```

####Set the credentials for the crawler
Windows Command Prompt:

```
set SCTE_PROXY_USERNAME=<whatever it should be>
set SCTE_PROXY_PASSWORD=<whatever it should be>
```

Windows GitBash and Mac:
```
export SCTE_PROXY_USERNAME=<whatever it should be>
export SCTE_PROXY_PASSWORD=<whatever it should be>
```

Heroku (toolbelt):
```
heroku config:set SCTE_PROXY_USERNAME=<whatever>
heroku config:set SCTE_PROXY_PASSWORD=<whatever>
```

####If developing, run it like this
```
devtool proxy.js --watch --save-live-edit
```

####Otherwise, run it like this
```
node proxy.js
```


####Heroku
Push it like any other Heroku app.

####Set the SP13 server to use proxy address and port.
