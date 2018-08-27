"use strict";

module.exports.createContext = function(jpressContext) {

    if (!jpressContext.googleClientId) {
        throw new Error("googleClientId is not defined. This is required to enable Google API based authentication");
    }

    var theModule = {};

    theModule.init = async function(jservice) {

    };

    theModule.getContext = function() {
        return jpressContext;
    };

    return theModule;

};