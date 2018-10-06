"use strict";

// ============================================================================
// This service provides high level methods to manipulate single-use tokens
// ============================================================================

var mod = {};
var priv = {};
priv.tableName = "token";

// ============================================================================
module.exports.init = async function(jservice) {
    mod.mongo = await jservice.get("mongo");
    mod.log = await jservice.get("log");
};