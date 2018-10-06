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

    // Create the collection
    db.createCollection("prod-blog-jstudios", function(err, res) {
        if (err) {
            console.error(err);
            return;
        } else {
            console.info("Collection created");
        }
    });

}

main();
