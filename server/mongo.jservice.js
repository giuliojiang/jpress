"use strict";

// ============================================================================
// This service wraps around the mongodb connector for Node.js
// providing easy to use, promisified methods for the most
// common operations.
// Connection to the database is performed during initialization
// of the service.
// ============================================================================

const util = require("util");
const MongoClient = require("mongodb").MongoClient;

var mod = {};
var priv = {};
priv.db = null;
priv.collection = null;

// ============================================================================
module.exports.init = async function(jservice) {
    mod.context = await jservice.get("context");

    // Connect to database
    var mongoUrl = mod.context.getContext().mongoConnectionUrl;
    var mongoClientConnectFunc = util.promisify(MongoClient.connect);
    var client = await mongoClientConnectFunc(mongoUrl);
    priv.db = client.db("test");
    var collectionName = mod.context.getContext().mongoCollectionName;
    priv.collection = priv.db.collection(collectionName);
};

// ============================================================================
// Inserts one document into the database
// Parameters
//     theObj - The new document to be inserted
// Return: of type https://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#~insertOneWriteOpResult
module.exports.insertOne = function(theObj) {
    return new Promise((resolve, reject) => {
        priv.collection.insertOne(theObj, function(err, res) {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

// ============================================================================
// Finds documents
// Parameters
//     query - MongoDB query object
//     limit - Max number of results
// Return
//     result - Array of objects
module.exports.find = function(query, limit) {
    return new Promise((resolve, reject) => {
        priv.collection.find(query).limit(limit).toArray(function(err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        })
    });
};