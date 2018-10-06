"use strict";

// ============================================================================
// This utility lists the last few cached logged in users,
// and waits for the user to enter on the command line the userId (google unique
// id) of the user to be made admin
// ============================================================================

var MongoClient = require('mongodb').MongoClient;
var util = require("util");
var readline = require("readline");

// Edit this for connection + password string
var uri = require(path.join(__dirname, "url.js")).url;

// Edit the name of the collection
var collectionName = "jpress";

var main = async function() {

    // Connect
    var mongoClientConnectFunc = util.promisify(MongoClient.connect);
    var client = await mongoClientConnectFunc(uri);

    // Get the db
    var db = client.db("test");
    console.info("Got a db? " + !!db);

    // Get collection
    var collection = db.collection(collectionName);

    // Pre-define functions
    var findFunc = function(query, sort, limit) {
        return new Promise((resolve, reject) => {
            collection.find(query).sort(sort).limit(limit).toArray(function(err, res) {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    };
    var insertFunc = function(newDoc) {
        return new Promise((resolve, reject) => {
            collection.insertOne(newDoc, function(err, res) {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    };
    
    // Find last few login entries
    var loginDocs = await findFunc({
        table: "auth",
        isAdmin: false
    }, {
        loginTime: -1
    }, 10);
    console.info("Listing the last few logged in users. Count: " + loginDocs.length);
    for (var i = 0; i < loginDocs.length; i++) {
        var aDoc = loginDocs[i];
        console.info("Doc ["+ i +"]: " + JSON.stringify(aDoc));
    }

    // Read STDIN inputs
    console.info("Input the number of the user to be admin-ed");
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    rl.on("line", async function(line) {
        var theNum = parseInt(line);
        var theDoc = loginDocs[theNum];
        var res = await insertFunc({
            table: "user",
            userId: theDoc.userId
        });
        console.info("Made admin " + JSON.stringify(theDoc));
        console.info("Inserted: " + JSON.stringify(res.ops));
    });

}

main();