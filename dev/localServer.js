var express = require("express");
var jpressIndex = require("./../server/index.js");

var app = express();

app.use("/", jpressIndex.createApp());

app.listen(3000, () => {
    console.log("Dev server listening on port 3000");
})