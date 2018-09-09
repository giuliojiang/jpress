"use strict";

var mod = {};
var priv = {};
priv.enable = false;

// ============================================================================
module.exports.init = async function(jservice) {
    mod.context = await jservice.get("context");

    priv.enable = mod.context.getContext().enableLogging;
}

// ============================================================================
module.exports.info = function(theString) {
    if (priv.enable) {
        console.info(theString);
    }
}