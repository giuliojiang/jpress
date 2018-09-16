"use strict";

const showdown = require("showdown");
const converter = new showdown.Converter();

var mod = {};
var priv = {};

// ============================================================================

module.exports.init = async function(jservice) {

    mod.handlers = await jservice.get("handlers");
    mod.msgobj = await jservice.get("msgobj");
    mod.mongoposts = await jservice.get("mongoposts");

    mod.handlers.register("write_preview", 2, module.exports.handlePreview);
    mod.handlers.register("write_post", 2, module.exports.handlePost);

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

// ============================================================================

module.exports.handlePost = async function(msgobj) {

    try {
        var titleField = mod.msgobj.getString(msgobj, "title");
        var bodyField = mod.msgobj.getString(msgobj, "body");
        var postidField = mod.msgobj.getNullableString(msgobj, "postid");

        // Check for empty strings
        if (titleField == "") {
            return {
                _t: "write_post",
                status: false,
                message: "Post title cannot be empty"
            };
        }
        if (bodyField == "") {
            return {
                _t: "write_post",
                status: false,
                message: "Post body cannot be empty"
            };
        }

        var status = false;
        if (postidField == null) {
            // New post
            await mod.mongoposts.newPost(titleField, bodyField);
            status = true;
        } else {
            // Update existing post
            status = await mod.mongoposts.updatePost(postidField, titleField, bodyField);
        }

        // Send OK
        return {
            _t: "write_post",
            status: status
        };
    } catch (err) {
        if (err instanceof mod.msgobj.MsgobjKeyError) {
            console.info("Got a key error");
            return null;
        } else {
            return {
                _t: "write_post",
                status: false,
                message: "Error when saving post"
            };
        }
    }

}