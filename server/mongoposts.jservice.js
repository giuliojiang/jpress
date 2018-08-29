"use strict";

// ============================================================================
// This service provides high level methods to manipulate database
// entries for blog posts.
// ============================================================================

var mod = {};
var priv = {};
priv.tableName = "posts";

// ============================================================================
module.exports.init = async function(jservice) {
    mod.mongo = await jservice.get("mongo");
};

// ============================================================================
module.exports.newPost = async function(title, body) {
    // Generate the date
    var nowDate = new Date();
    var nowMillis = nowDate.getTime();

    var newDoc = {
        table: priv.tableName,
        datePosted: nowMillis,
        title: title,
        body: body
    };

    await mod.mongo.insertOne(newDoc);
};