"use strict";

// Utilities to extract and check common properties from
// user-sent messages

var mod = {};
var priv = {};

// ============================================================================

module.exports.init = function(jservice) {

}

// ============================================================================

module.exports.MsgobjKeyError = class extends Error {};

// ============================================================================

module.exports.getString = function(msgobj, key) {

    if (msgobj.hasOwnProperty(key)) {
        var theVal = msgobj[key];
        if (typeof theVal === 'string' || theVal instanceof String) {
            return theVal;
        } else {
            throw new module.exports.MsgobjKeyError();
        }
    } else {
        throw new module.exports.MsgobjKeyError();
    }

}