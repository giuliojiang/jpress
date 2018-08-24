var mod = {};
var priv = {};

// Map: string -> handler
// where handler: msgobj async function(msgobj)
//     A handler is an async function that takes a msgobj (an JS object)
//     of the message, and async-returns (a promise) the reply message.
var registeredHandlers = {};

module.exports.init = function(jservice) {
    mod.util = jservice.get("util");
}

module.exports.register = function(key, handler) {
    if (registeredHandlers.hasOwnProperty(key)) {
        throw new Error("Key ["+ key +"] already has a handler");
    }
    registeredHandlers[key] = handler;
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
