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
var authenticationLevels = {};

module.exports.init = async function(jservice) {
    mod.util = await jservice.get("util");
}

module.exports.register = function(key, authenticationLevel, handler) {
    if (registeredHandlers.hasOwnProperty(key)) {
        throw new Error("Key ["+ key +"] already has a handler");
    }
    registeredHandlers[key] = handler;
    authenticationLevels[key] = authenticationLevel
}

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
        // TODO check authentication level
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
