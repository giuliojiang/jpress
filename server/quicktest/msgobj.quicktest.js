"use strict";

var mod = {};
var priv = {};
var expect = require("chai").expect;
var quick = require("./lib/quick.js");
var jservice = require("./../jservice.js");

module.exports.run = async function() {

    jservice.register("msgobj", require("./../msgobj.jservice.js"));

    mod.msgobj = jservice.get("msgobj");

    // ------------------------------------------------------------------------
    // Standard get
    {
        var aMsg = {
            _t: "testtype",
            field: "abcd"
        };
        var theField = mod.msgobj.getString(aMsg, "field");
        expect(theField).to.equal("abcd");
    }

    // ------------------------------------------------------------------------
    // Get non existing field
    {
        var aMsg = {
            _t: "testtype",
            field: "abcd"
        };
        expect(function() {
            mod.msgobj.getString(aMsg, "notThisOne")
        }).to.throw(mod.msgobj.MsgobjKeyError);

    }

    // ------------------------------------------------------------------------
    // Get field with wrong type
    {
        var aMsg = {
            _t: "testtype",
            field: 1234
        };
        expect(function() {
            mod.msgobj.getString(aMsg, "field")
        }).to.throw(mod.msgobj.MsgobjKeyError);
    }

};

quick.execute(module.exports);