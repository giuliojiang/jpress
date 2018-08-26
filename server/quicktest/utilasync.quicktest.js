"use strict";

var mod = {};
var priv = {};
var expect = require('chai').expect;
var quick = require("./lib/quick.js");
var jservice = require("./../jservice.js");

module.exports.run = async function() {

    jservice.register("utilasync", require("./../utilasync.jservice.js"));
    
    mod.utilasync = jservice.get("utilasync");

    // ------------------------------------------------------------------------
    {
        var foo = "bar";
        expect(foo).to.be.a('string');

        var stat = await mod.utilasync.fsStat("./etc/afile");
        expect(stat.isFile()).to.be.true;
    }

    // ------------------------------------------------------------------------
    {
        var fileContents = await mod.utilasync.fsReadFile("./etc/afile", "utf8");
        expect(fileContents).to.equal("some content");
    }

};

quick.execute(module.exports);