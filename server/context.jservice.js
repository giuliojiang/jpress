"use strict";

var checkKey = function(theObj, theKey) {
    if (!theObj.hasOwnProperty(theKey)) {
        throw new Error("Key ["+ theKey +"] is not defined. This is required in jpress Context");
    }
}

module.exports.createContext = function(jpressContext) {

    checkKey(jpressContext, "blogName");
    checkKey(jpressContext, "googleClientId");
    checkKey(jpressContext, "mongoConnectionUrl");
    checkKey(jpressContext, "mongoCollectionName");
    checkKey(jpressContext, "enableLogging");

    var theModule = {};

    theModule.init = async function(jservice) {

    };

    theModule.getContext = function() {
        return jpressContext;
    };

    return theModule;

};