var path = require("path");
var context = require("./context.jservice.js");
var jservice = require(path.join(__dirname, "jservice.js"));

var find_service = function(name) {
    jservice.register(name, require(path.join(__dirname, name + ".jservice.js")));
};

module.exports.createApp = async function(jpressContext) {

    // Register services ----------------------------------------------------------
    find_service("app");
    find_service("apimainhandler");
    find_service("s3mainhandler");
    find_service("staticmainhandler");
    find_service("util");
    find_service("utilasync");
    find_service("handlers");
    find_service("handler_write");
    find_service("msgobj");
    find_service("authentication");
    jservice.register("context", context.createContext(jpressContext));

    // Start eager services ---------------------------------------------------
    await jservice.get("handler_write");

    var theApp = await jservice.get("app");
    return theApp.createApp();

};
