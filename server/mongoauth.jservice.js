"use strict";

var mod = {};
var priv = {};

// ============================================================================
module.exports.init = async function(jservice) {
    mod.mongo = await jservice.get("mongo");
}

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
    var results = await mod.mongo.find(query, limit);
    return results;
}

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
    var numberDeleted = await mod.mongo.deleteMany(query);
    return numberDeleted;
}

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
    var numberDeleted = await mod.mongo.deleteMany(query);
    return numberDeleted;
}

// ============================================================================
// Insert new document in database
module.exports.insert = async function(googleToken, userId, name, isAdmin, loginTime) {
    var newDoc = {
        table: "auth",
        googleToken: googleToken,
        userId: userId,
        name: name,
        isAdmin: isAdmin,
        loginTime: loginTime
    };
    await mod.mongo.insertOne(newDoc);
}