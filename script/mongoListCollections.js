var MongoClient = require('mongodb').MongoClient;
var util = require("util");

var uri = require(path.join(__dirname, "url.js")).url;

var main = async function() {

    // Connect
    var mongoClientConnectFunc = util.promisify(MongoClient.connect);
    var client = await mongoClientConnectFunc(uri);

    // Get the db
    var db = client.db("test");
    console.info("Got a db? " + !!db);

    // Get collections
    var listCollectionsFunc = function() {
        console.info("Inside listCollectionsFunc");
        return new Promise((resolve, reject) => {
            console.info("Inside the promise stuff...");
            db.listCollections().toArray(function(err, res) {
                console.info("Inside the callback");
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    }
    var collInfos = await listCollectionsFunc();
    console.info("Number of collections: " + collInfos.length);
    for (var i = 0; i < collInfos.length; i++) {
        var aCollInfo = collInfos[i];
        console.info(aCollInfo.name);
    }

}

main();