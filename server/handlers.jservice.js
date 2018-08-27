var mod = {};
var priv = {};

// Map: string -> handler
// where handler: msgobj async function(msgobj)
//     A handler is an async function that takes a msgobj (an JS object)
//     of the message, and async-returns (a promise) the reply message.
var registeredHandlers = {};

// Map: message type -> authentication level
// message type: String
// authentication level: Integer.
//     0 requires no authentication
//     1 requires user logged in
//     2 requires user admin
var authenticationLevels = {};

module.exports.init = async function(jservice) {
    mod.util = await jservice.get("util");
    mod.authentication = await jservice.get("authentication");
}

module.exports.register = function(key, authenticationLevel, handler) {
    if (registeredHandlers.hasOwnProperty(key)) {
        throw new Error("Key ["+ key +"] already has a handler");
    }
    registeredHandlers[key] = handler;
    authenticationLevels[key] = authenticationLevel;
}

// ============================================================================
// Returns: boolean
//     true: user is allowed to perform the message
//     false: user is not allowed or an error occurred
priv.checkAuthenticationLevel = async function(msgobj, key) {
    if (authenticationLevels.hasOwnProperty(key)) {

        // Get required authentication level
        var requiredLevel = authenticationLevels[key];

        // Level 0 does not require any authentication
        if (requiredLevel == 0) {
            return true;
        }

        // Get user sign in token
        var tok = msgobj["_tok"];
        if (!mod.util.is_string(tok)) {
            return null;
        }

        // Contact google servers for user data
        var actualLevel = 0;
        var userData;
        try {
            userData = await mod.authentication.authenticate(tok);
        } catch (err) {
            console.error("handlers: Authentication error: ", err);
            // Failure to login
            return false;
        }

        if (userData) {
            actualLevel = 1;
        } else {
            actualLevel = 0;
        }

        // TODO admin-level checks with database

        return actualLevel >= requiredLevel;

    } else {
        console.info("handlers: No authentication info for key ["+ key +"]");
        return false;
    }
};

// ============================================================================
// Returns a (promise) msgobj
module.exports.handle = async function(msgobj) {
    try {
        if (!mod.util.isObject(msgobj)) {
            return null;
        }
        var key = msgobj["_t"];
        if (!mod.util.is_string(key)) {
            return null;
        }
        
        // Check authentication levels
        var authenticationPass = await priv.checkAuthenticationLevel(msgobj, key);
        if (!authenticationPass) {
            // Authentication failed
            return null;
        }

        // Get and call the handler
        if (registeredHandlers.hasOwnProperty(key)) {
            var theHandler = registeredHandlers[key];
            return await theHandler(msgobj);
        } else {
            console.info("handlers: No handler for key ["+ key +"]");
            return null;
        }
    } catch (err) {
        console.error("handlers: Unexpected error: ", err);
        return null;
    }
}
