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
// Return:
//     status: true if successful, false if error
module.exports.updatePost = async function(postid, title, body) {
    mod.log.info("mongoposts: Updating post ["+ postid +"]");
    var query = {
        _id: new ObjectId(postid)
    };
    var doc = {
        $set: {
            title: title,
            body: body
        }
    };
    var res = await mod.mongo.updateOne(query, doc);
    var numberUpdated = res.result.nModified;
    mod.log.info("mongoposts: Number of rows modified: ["+ numberUpdated +"]");
    return (numberUpdated === 1);
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
    return await mod.mongo.findLimitSkipSort(query, skip, limit, sort);
};

// ============================================================================
// Return:
//     docs: array of documents
module.exports.getSinglePost = async function(postId) {
    var query = {
        _id: new ObjectId(postId)
    };
    mod.log.info("mongoposts: getSinglePost. Query is " + JSON.stringify(query));
    var docs = await mod.mongo.find(query, 1);
    mod.log.info("mongoposts: getSinglePost. docs are " + JSON.stringify(docs));
    return docs;
};

// ============================================================================
// Parameters:
//     postId: _id field of the post to be deleted
// Return:
//     delete: boolean, true if a post was deleted, false otherwise
module.exports.deleteById = async function(postId) {
    var query = {
        _id: new ObjectId(postId)
    };
    var numberDeleted = await mod.mongo.deleteMany(query);
    return numberDeleted === 1;
};