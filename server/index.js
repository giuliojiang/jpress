var path = require("path");
var jservice = require(path.join(__dirname, "jservice.js"));

var find_service = function(name) {
    jservice.register(name, require(path.join(__dirname, name + ".jservice.js")));
};

module.exports.createApp = function() {

    // Register services ----------------------------------------------------------
    find_service("app");
    find_service("apimainhandler");
    find_service("s3mainhandler");

    return jservice.get("app").createApp();

};
