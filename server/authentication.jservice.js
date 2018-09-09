"use strict";

const {OAuth2Client} = require('google-auth-library');

var mod = {};
var priv = {};
priv.client = null;
priv.CACHE_DURATION = 60 * 1000; // 60 seconds

// ============================================================================
module.exports.init = async function(jservice) {

    mod.context = await jservice.get("context");
    mod.mongoauth = await jservice.get("mongoauth");
    mod.log = await jservice.get("log");
    mod.mongouser = await jservice.get("mongouser");
    priv.client = new OAuth2Client(mod.context.getContext().googleClientId);

};

// ============================================================================
module.exports.authenticateDirect = async function(googleToken) {
    var ticket;
    try {
        ticket = await priv.client.verifyIdToken({
            idToken: googleToken,
            audience: mod.context.getContext().googleClientId
        });
    } catch (err) {
        console.error("Authentication error: ", err);
        return null;
    }

    const payload = ticket.getPayload();
    const userId = payload["sub"];
    var username = payload["name"];

    var isAdmin = await mod.mongouser.userExists(userId);

    return {
        id: userId,
        name: username,
        isAdmin: isAdmin
    };

};

// ============================================================================
module.exports.authenticate = async function(googleToken) {
    mod.log.info("authentication: token " + googleToken);
    var cachedUsers = await mod.mongoauth.get(googleToken);
    if (cachedUsers.length == 1) {
        // Cache hit
        mod.log.info("authentication: Cache hit");
        return cachedUsers[0];
    } else {
        // Cache miss, use authenticateDirect
        mod.log.info("authentication: Cache miss");
        var userData = await module.exports.authenticateDirect(googleToken);
        if (userData == null) {
            // Authentication failed
            mod.log.info("authentication: Authentication failed");
            return null;
        } else {
            // Authentication success
            mod.log.info("authentication: Authentication success");
            // Insert into cache
            var newDocId = await mod.mongoauth.insert(googleToken, userData.id, userData.name, userData.isAdmin, new Date().getTime());
            // Schedule removal from cache
            priv.scheduleRemoval(newDocId);
            // Return result
            return userData;
        }
    } 
}

// ============================================================================
priv.scheduleRemoval = function(docId) {
    mod.log.info("authentication: Created scheduled removal task");
    setTimeout(async function() {
        var numberDeleted = await mod.mongoauth.removeById(docId);
        mod.log.info("authentication: Scheduled removal of document ID ["+ docId +"]: ["+ numberDeleted +"]");
    }, priv.CACHE_DURATION);
}