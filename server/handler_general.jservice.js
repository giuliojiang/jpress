"use strict";

var mod = {};
var priv = {};

// ============================================================================
module.exports.init = async function(jservice) {
    mod.handlers = await jservice.get("handlers");
    mod.mongoauth = await jservice.get("mongoauth");
    mod.msgobj = await jservice.get("msgobj");

    mod.handlers.register("general_logout", 1, module.exports.handleLogout);
};

// ============================================================================
module.exports.handleLogout = async function(msgobj) {
    var googleToken = mod.msgobj.getString(msgobj, "_tok");
    await mod.mongoauth.removeByToken(googleToken);
    return {
        _t: "general_logout"
    };
};