"use strict";

var path = require("path");
var mod = {};
var priv = {};
priv.htmlPath = path.join(__dirname, "../template/write/write.html");

module.exports.init = async function(jservice) {
    mod.domutils = await jservice.get("domutils");
};

// ============================================================================

module.exports.generateDOM = async function(baseUrl, postId) {
    var dom = await mod.domutils.loadDom(priv.htmlPath);

    // Add script element with post ID
    var injectPostId = "";
    if (!postId) {
        injectPostId = 'jpress.vars.writePostId = null;';
    } else {
        injectPostId = 'jpress.vars.writePostId = "'+postId+'";';
    }
    var scriptElem = dom.window.document.createElement("script");
    scriptElem.text = injectPostId;
    dom.window.document.head.appendChild(scriptElem);

    return dom;
};