"use strict";

var mod = {};
var priv = {};

// ============================================================================

module.exports.init = async function(jservice) {

    mod.handlers = await jservice.get("handlers");
    mod.msgobj = await jservice.get("msgobj");

    mod.handlers.register("panel_login", 2, module.exports.panelLogin);

};

// ============================================================================

module.exports.panelLogin = async function(msgobj) {
    // If we get here, then the user is admin
    return {
        _t: "panel_login"
    };
};