"use strict";

const {OAuth2Client} = require('google-auth-library');

var mod = {};
var priv = {};
priv.client = null;

// ============================================================================
module.exports.init = async function(jservice) {

    mod.context = await jservice.get("context");
    priv.client = new OAuth2Client(mod.context.getContext().googleClientId);

};

// TODO Implement MongoDB-cached authentication:
// Re-verify a token using google services only once every
// 5 minutes or so to reduce the rate of requests

// ============================================================================
module.exports.authenticate = async function(googleToken) {
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

    return {
        id: userId,
        name: username
    };

};