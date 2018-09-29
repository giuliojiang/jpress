"use strict";

var mod = {};
var priv = {};

// ============================================================================

module.exports.init = async function(jservice) {

    mod.handlers = await jservice.get("handlers");
    mod.msgobj = await jservice.get("msgobj");
    mod.mongoposts = await jservice.get("mongoposts");

    mod.handlers.register("panel_login", 2, module.exports.panelLogin);
    mod.handlers.register("panel_delete_by_id", 2, module.exports.panelDeleteById);
};

// ============================================================================

module.exports.panelLogin = async function(msgobj) {
    // If we get here, then the user is admin
    return {
        _t: "panel_login"
    };
};

// ============================================================================

module.exports.panelDeleteById = async function(msgobj) {
    var postid = mod.msgobj.getString(msgobj, "postid");

    var deleted = await mod.mongoposts.deleteById(postid);
    if (deleted) {
        return {
            status: "ok"
        }
    } else {
        return {
            status: "fail"
        }
    }
};