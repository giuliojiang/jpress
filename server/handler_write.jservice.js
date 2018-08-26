"use strict";

var mod = {};
var priv = {};

// ============================================================================

module.exports.init = function(jservice) {

    mod.handlers = jservice.get("handlers");
    mod.msgobj = jservice.get("msgobj");

    mod.handlers.register("write_preview", 1, module.exports.handlePreview);

}

// ============================================================================

module.exports.handlePreview = async function(msgobj) {

    try {
        var textField = mod.msgobj.getString(msgobj, "text");
        // TODO RESUME
    } catch (err) {
        if (err instanceof mod.msgobj.MsgobjKeyError) {
            // do nothing
        } else {
            throw err;
        }
    }

}
