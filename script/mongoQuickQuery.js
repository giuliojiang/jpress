var MongoClient = require('mongodb').MongoClient;
var util = require("util");

// Edit this for connection + password string
var uri = require(path.join(__dirname, "url.js")).url;

// Edit the name of the collection
var collectionName = "jpress";

// Edit this object to modify the query
var queryObj = {};

// Limit the number of objects returned
var limitNumber = 100;

var main = async function() {

    // Connect
    var mongoClientConnectFunc = util.promisify(MongoClient.connect);
    var client = await mongoClientConnectFunc(uri);

    // Get the db
    var db = client.db("test");
    console.info("Got a db? " + !!db);

    // Get collection
    var collection = db.collection(collectionName);

    // Find function
    var findFunc = function() {
        return new Promise((resolve, reject) => {
            collection.find(queryObj).limit(limitNumber).toArray(function(err, res) {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    };
    var res = await findFunc();
    console.info("Number of objects returned: ", res.length);
    for (var i = 0; i < res.length; i++) {
        console.info("Result ["+ i +"]: ", JSON.stringify(res[i]));
    }

    client.close();

}

main();