"use strict";

const showdown = require("showdown");
const converter = new showdown.Converter();

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
        var compiledHtml = converter.makeHtml(textField);
        // HTML is not sanitized because only site admin
        // can create blog posts, and site admin is trusted
        var resp = {
            _t: "write_preview",
            html: compiledHtml
        };
        return resp;
    } catch (err) {
        if (err instanceof mod.msgobj.MsgobjKeyError) {
            return null;
        } else {
            throw err;
        }
    }

}
