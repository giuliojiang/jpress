"use strict";

// This express app is the template engine to serve
// dynamic HTML files

var mod = {};
var priv = {};
priv.jsPath = "./../template/jpress.js";
priv.headerPath = "./../template/header.html";
priv.footerPath = "./../template/footer.html";

var express = require("express");

// ============================================================================
module.exports.init = async function(jservice) {
    mod.utilasync = await jservice.get("utilasync");
    mod.util = await jservice.get("util");
    mod.context = await jservice.get("context");
    mod.domutils = await jservice.get("domutils");
    mod.postsprocessor = await jservice.get("postsprocessor");
    mod.log = await jservice.get("log");
}

// ============================================================================
module.exports.createApp = function() {
 
    var app = express();

    app.get("/", async function(req, res) {
        var dom = await mod.postsprocessor.getPosts(0, req.baseUrl);
        await module.exports.processTemplateDOM(dom, req, res);
    });

    app.get("/more/:page", async function(req, res) {
        var pageNumber = parseInt(req.params.page);
        if (!mod.util.is_number(pageNumber)) {
            res.sendStatus(404);
            return;
        }
        var dom = await mod.postsprocessor.getPosts(pageNumber, req.baseUrl);
        await module.exports.processTemplateDOM(dom, req, res);
    });

    app.get("/post/:postid", async function(req, res) {
        var postId = req.params.postid;
        var dom = await mod.postsprocessor.getSinglePost(req.baseUrl, postId);
        if (dom == null) {
            mod.log.info("templatemainhandler: get post. Dom is null");
            res.sendStatus(404);
        } else {
            await module.exports.processTemplateDOM(dom, req, res);
        }
    });

    app.get("/write", function(req, res) {
        module.exports.processTemplate("./../template/write/write.html", req, res);
    });

    return app;

}

module.exports.processTemplateDOM = async function(theDom, req, res) {

    var mainDom = theDom;

    // Load header
    var headerDom = await mod.domutils.loadDom(priv.headerPath);
    
    // Load footer
    var footerDom = await mod.domutils.loadDom(priv.footerPath);

    // Load jpressJS
    var jpressJS = await mod.utilasync.fsReadFile(priv.jsPath, "utf8");

    // Perform jpressJS replacements
    jpressJS = mod.util.stringReplaceAll(jpressJS, "JPRESSREPLACE_BASEURL", req.baseUrl);
    jpressJS = mod.util.stringReplaceAll(jpressJS, "JPRESSREPLACE_GSIGNIN_CLIENTID", mod.context.getContext().googleClientId);
    jpressJS = mod.util.stringReplaceAll(jpressJS, "JPRESSREPLACE_BLOG_NAME", mod.context.getContext().blogName);

    // Insert jpressJS into the document
    var scriptElem = mainDom.window.document.createElement("script");
    scriptElem.text = jpressJS;
    var headElement = mainDom.window.document.head;
    headElement.insertBefore(scriptElem, headElement.firstChild);

    // Insert header content
    var headerElem = mainDom.window.document.getElementById("jpress-header");
    headerElem.innerHTML = headerDom.window.document.body.innerHTML;

    // Insert footer content
    var footerElem = mainDom.window.document.getElementById("jpress-footer");
    footerElem.innerHTML = footerDom.window.document.body.innerHTML;

    var finalHtml = mainDom.serialize();
    res.send(finalHtml);
    return;
}

// ============================================================================
// Parameters:
//     htmlPath: the path to the template HTML file
//     req: expressJS req object
//     res: expressJS res object
// Return: nothing
module.exports.processTemplate = async function(htmlPath, req, res) {

    // Load the HTML template file
    var mainDom = await mod.domutils.loadDom(htmlPath);

    await module.exports.processTemplateDOM(mainDom, req, res);

};
