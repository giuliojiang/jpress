var express = require("express");
var jpressIndex = require("./../server/index.js");

process.on('uncaughtException', (err) => {
    console.error("Uncaught exception: ", err);
});

var main = async function() {
    var app = express();

    app.use("/jpress", jpressIndex.createApp({
        googleClientId: null
    }));
    
    app.listen(3000, () => {
        console.log("Dev server listening on port 3000");
    })
}

