var fs;
var app;
var https;

var config;

var server = null;

// init -----------------------------------------------------------------------

var init = function(jservice) {
    fs = require("fs");
    app = require("express")();
    https = require("https");

    config = jservice.get("config");
};

// get_https_server -----------------------------------------------------------

var get_https_server = function() {

    if (!server) {

        var server = https.createServer({
            key: fs.readFileSync(config.vals.privkey),
            cert: fs.readFileSync(config.vals.cert)
        }, app);

        var port = config.vals.port;
        server.listen(config.vals.port);
        console.info("https_server.jservice: Port " + port);
    }

    return server;

};


// Exports --------------------------------------------------------------------

module.exports = {
    init: init,
    get_https_server: get_https_server
};
