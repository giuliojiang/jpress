"use strict";

var mod = {};
var priv = {};
var expect = require('chai').expect;
var quick = require(path.join(__dirname, "lib/quick.js"));
var jservice = require(path.join(__dirname, "../jservice.js"));

module.exports.run = async function() {

    jservice.register("utilasync", require(path.join(__dirname, "../utilasync.jservice.js")));
    
    mod.utilasync = await jservice.get("utilasync");

    // ------------------------------------------------------------------------
    {
        var foo = "bar";
        expect(foo).to.be.a('string');

        var stat = await mod.utilasync.fsStat(path.join(__dirname, "etc/afile"));
        expect(stat.isFile()).to.be.true;
    }

    // ------------------------------------------------------------------------
    {
        var fileContents = await mod.utilasync.fsReadFile(path.join(__dirname, "etc/afile", "utf8"));
        expect(fileContents).to.equal("some content");
    }

};

quick.execute(module.exports);