"use strict";

var mod = {};
var priv = {};
priv.purgeSafeDuration = 24 * 60 * 60 * 1000; // Entries older than 1 day

// ============================================================================
module.exports.init = async function(jservice) {
    mod.mongo = await jservice.get("mongo");
    mod.log = await jservice.get("log");

    // Purge entries older than 1 day
    var now = new Date().getTime();
    now = now - priv.purgeSafeDuration; // Subtract 1 day
    var purgedNumber = await module.exports.purgeOld(now);
    mod.log.info("mongoauth: Removed ["+ purgedNumber +"] entries from authentication cache");
};

// ============================================================================
// Parameters:
//     googleToken: the google token to perform search
// Return:
//     result: array of documents that match the query
module.exports.get = async function(googleToken) {
    var query = {
        googleToken: googleToken
    };
    var limit = 1;
    return await mod.mongo.find(query, limit);
};

// ============================================================================
// Purges entries older than the threshold time
// Parameters:
//     thresholdTime - time in milliseconds
// Return:
//     numberDeleted - Number of documents deleted
module.exports.purgeOld = async function(thresholdTime) {
    var query = {
        loginTime: {$lt: thresholdTime}
    };
    return await mod.mongo.deleteMany(query);
};

// ============================================================================
// Remove an entry by document ID
// Parameters:
//     docId - Document ID in the MongoDB database
// Return:
//     numberDeleted - number of documents deleted
module.exports.removeById = async function(docId) {
    var query = {
        _id: docId
    };
    return await mod.mongo.deleteMany(query);
};

// ============================================================================
// Insert new document in database
// Return:
//     insertedId: ID of document inserted
module.exports.insert = async function(googleToken, userId, name, isAdmin, loginTime) {
    var newDoc = {
        table: "auth",
        googleToken: googleToken,
        userId: userId,
        name: name,
        isAdmin: isAdmin,
        loginTime: loginTime
    };
    var res = await mod.mongo.insertOne(newDoc);
    return res.insertedId;
};

// ============================================================================
// Removes by token
// Parameters:
//     googleToken: string, google authentication token
// Return:
//     (undefined)
module.exports.removeByToken = async function(googleToken) {
    mod.log.info("mongoauth: removeByToken. Removing token ["+ googleToken +"]");
    var query = {
        googleToken: googleToken
    };
    var res = await mod.mongo.deleteMany(query);
    mod.log.info("mongoauth: removeByToken. Removed ["+ res +"] entries from db");
};