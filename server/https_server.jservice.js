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

        var port = 21555;
        server.listen(port);
        console.info("https_server.jservice: Port " + port);
    }

    return server;

};

// get_express_app ------------------------------------------------------------

var get_express_app = function() {

    return app;

};


// Exports --------------------------------------------------------------------

module.exports = {
    init: init,
    get_https_server: get_https_server,
    get_express_app: get_express_app
};
