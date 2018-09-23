# jpress

A minimalistic blog

# How to use

jpress is a standard Express app.

Install jpress

```
npm --save install giuliojiang/jpress
```

And create a new file for your express server

```javascript
var express = require("express");
var https = require('https');
var path = require("path");
var fs = require("fs");
var privateKey  = fs.readFileSync("./key.pem", 'utf8');
var certificate = fs.readFileSync("./cert.pem", 'utf8');

var jpressIndex = require("jpress");

process.on('uncaughtException', (err) => {
    console.error("Uncaught exception: ", err);
});

var credentials = {key: privateKey, cert: certificate};
var express = require('express');

var main = async function() {
    var app = express();

    var theJpressApp = await jpressIndex.createApp({
        googleClientId: "<YOUR GOOGLE OAUTH CLIENT ID>",
        blogName: "<THE NAME OF YOUR BLOG>",
        mongoConnectionUrl: "<YOUR CONNECTION URL>",
        mongoCollectionName: "<THE MONGODB COLLECTION TO BE USED>",
        enableLogging: true
    });

    app.use("/jpress", theJpressApp);
    
    var httpsServer = https.createServer(credentials, app);
    httpsServer.listen(443);
    
};

main();
```

You will need a Google API Client ID for the google sign in. Visit https://developers.google.com/identity/sign-in/web/sign-in#before_you_begin to Configure a Project. Replace the Client ID token in the code.

`key.pem` and `cert.pem` are standard SSL certificates for your HTTPS website. If you are testing locally, you can self-generate a certificate. See https://stackoverflow.com/questions/10175812/how-to-create-a-self-signed-certificate-with-openssl for how to generate certificate and key.
