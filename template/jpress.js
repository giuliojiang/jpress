"use strict";

window.jpress = {};
jpress.main = {};
jpress.vars = {};

// ============================================================================
// Inject constants
// These values are search-replaced on the server side dynamically
jpress.main.BASEURL = "JPRESSREPLACE_BASEURL";
jpress.main.GSIGNIN_CLIENTID = "JPRESSREPLACE_GSIGNIN_CLIENTID";
jpress.main.BLOG_NAME = "JPRESSREPLACE_BLOG_NAME";

// ============================================================================

jpress.main.loadJs = function(srcUrl) {
    var scriptElem = document.createElement("script");
    scriptElem.src = srcUrl;
    document.head.appendChild(scriptElem);
};

// ============================================================================

jpress.main.loadCss = function(srcUrl) {
    var elem = document.createElement("link");
    elem.setAttribute("rel", "stylesheet");
    elem.setAttribute("href", srcUrl);
    document.head.appendChild(elem);
}

// ============================================================================

jpress.main.gotoRelative = function(relUrl) {
    document.location = jpress.main.BASEURL + relUrl;
}

// ============================================================================
// Load the other JS files
jpress.main.init = function() {
    setTimeout(function() {
        jpress.main.loadCss("https://fonts.googleapis.com/css?family=PT+Serif");
        jpress.main.loadCss("https://unpkg.com/purecss@1.0.0/build/pure-min.css");
        jpress.main.loadCss(jpress.main.BASEURL + "/css/base.css");
        jpress.main.loadCss(jpress.main.BASEURL + "/css/jgrid.css");

        jpress.main.loadJs(jpress.main.BASEURL + "/lib/api.js");
        jpress.main.loadJs(jpress.main.BASEURL + "/lib/gsignin.js");
    }, 10);
    
}

// ============================================================================
jpress.main.init();
console.info("jpress.js loaded");