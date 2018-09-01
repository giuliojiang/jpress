"use strict";

window.jpress = {};
jpress.main = {};

// ============================================================================
// Inject constants
// These values are search-replaced on the server side dynamically
jpress.main.BASEURL = "JPRESSREPLACE_BASEURL";
jpress.main.GSIGNIN_CLIENTID = "JPRESSREPLACE_GSIGNIN_CLIENTID";

// ============================================================================

jpress.main.loadJs = function(srcUrl) {
    var scriptElem = document.createElement("script");
    scriptElem.src = srcUrl;
    document.head.appendChild(scriptElem);
};

// ============================================================================
// Load the other JS files
jpress.main.init = function() {
    jpress.main.loadJs(jpress.main.BASEURL + "/lib/api.js");
    jpress.main.loadJs(jpress.main.BASEURL + "/lib/gsignin.js");
}

// ============================================================================
jpress.main.init();
console.info("jpress.js loaded");