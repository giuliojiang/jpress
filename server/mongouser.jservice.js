"use strict";

var mod = {};
var priv = {};

// ============================================================================
module.exports.init = async function(jservice) {
    mod.mongo = await jservice.get("mongo");
};

// ============================================================================
// Parameters:
//     userId: unique google user id
// Returns:
//     exists: boolean
module.exports.userExists = async function(userId) {
    var query = {
        table: "user",
        userId: userId
    };
    var docs = await mod.mongo.find(query, 1);
    return docs.length === 1;
};