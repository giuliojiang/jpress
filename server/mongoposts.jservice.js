"use strict";

// ============================================================================
// This service provides high level methods to manipulate database
// entries for blog posts.
// ============================================================================

var ObjectId = require('mongodb').ObjectID;

var mod = {};
var priv = {};
priv.tableName = "posts";

// ============================================================================
module.exports.init = async function(jservice) {
    mod.mongo = await jservice.get("mongo");
    mod.log = await jservice.get("log");
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

// ============================================================================
// Get last few posts for the homepage feed
module.exports.getLastPosts = async function(limit, skip) {
    var query = {
        table: "posts"
    };
    var sort = {
        datePosted: -1
    };
    var docs = await mod.mongo.findLimitSkipSort(query, skip, limit, sort);
    return docs;
}

// ============================================================================
module.exports.getSinglePost = async function(postId) {
    var query = {
        _id: new ObjectId(postId)
    }
    mod.log.info("mongoposts: getSinglePost. Query is " + JSON.stringify(query));
    var docs = await mod.mongo.find(query, 1);
    mod.log.info("mongoposts: getSinglePost. docs are " + JSON.stringify(docs));
    return docs;
}