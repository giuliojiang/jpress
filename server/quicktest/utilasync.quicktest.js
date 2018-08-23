"use strict";

var mod = {};
var priv = {};
var expect = require('chai').expect;
var quick = require("./lib/quick.js");

process.on('uncaughtException', (err) => {
    console.error("Uncaught exception");
    console.error(err);
    process.exit(1);
});

var jservice = require("./../jservice.js");

module.exports.run = async function() {

    jservice.register("utilasync", require("./../utilasync.jservice.js"));
    
    mod.utilasync = jservice.get("utilasync");

    // ------------------------------------------------------------------------

    var foo = "bar";
    expect(foo).to.be.a('string');

    var stat = await mod.utilasync.fsStat("./etc/afile");
    expect(stat.isFile()).to.be.true;

};

quick.execute(module.exports);