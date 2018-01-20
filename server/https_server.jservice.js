var fs;
var app;
var https;

var server = null;

// init -----------------------------------------------------------------------

var init = function(jservice) {
    fs = require("fs");
    app = require("express")();
    https = require("https");
};

// get_https_server -----------------------------------------------------------

var get_https_server = function() {

    if (!server) {

        var server = https.createServer({
            key: fs.readFileSync("./../config/privkey.pem"),
            cert: fs.readFileSync("./../config/fullchain.pem")
        }, app);

        server.listen(21555);

    }

    return server;

};


// Exports --------------------------------------------------------------------

module.exports = {
    init: init,
    get_https_server: get_https_server
};
