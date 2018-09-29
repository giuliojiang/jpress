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
    mod.handlers.register("write_fetch", 2, module.exports.handleFetch);

};

// ============================================================================

module.exports.handlePreview = async function(msgobj) {

    try {
        var textField = mod.msgobj.getString(msgobj, "text");
        var compiledHtml = converter.makeHtml(textField);
        // HTML is not sanitized because only site admin
        // can create blog posts, and site admin is trusted
        return {
            _t: "write_preview",
            html: compiledHtml
        };
    } catch (err) {
        if (err instanceof mod.msgobj.MsgobjKeyError) {
            return null;
        } else {
            throw err;
        }
    }

};

// ============================================================================

module.exports.handlePost = async function(msgobj) {

    try {
        var titleField = mod.msgobj.getString(msgobj, "title");
        var bodyField = mod.msgobj.getString(msgobj, "body");
        var postidField = mod.msgobj.getNullableString(msgobj, "postid");

        // Check for empty strings
        if (titleField === "") {
            return {
                _t: "write_post",
                status: false,
                message: "Post title cannot be empty"
            };
        }
        if (bodyField === "") {
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

};

// ============================================================================

module.exports.handleFetch = async function(msgobj) {
    var postid = mod.msgobj.getNullableString(msgobj, "postid");

    // No postid, writing a new post
    if (!postid) {
        return {
            _t: "nopost"
        }
    }

    // Get post from database
    var thePost = await mod.mongoposts.getSinglePost(postid);
    if (thePost.length === 1) {
        var doc = thePost[0];
        return {
            _t: "post",
            title: doc.title,
            body: doc.body
        }
    } else {
        return {
            _t: "nopost"
        };
    }
};