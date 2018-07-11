

// Local ----------------------------------------------------------------------

var registered_handlers = {};

// init -----------------------------------------------------------------------

var init = function(jservice) {

};

// handle ---------------------------------------------------------------------

var handle_internal = function(msgobj, socket) {

    var t = msgobj._t;
    if (!t) {
        console.info("handlers.jservice: No _t in message: " + JSON.stringify(msgobj));
        return;
    }

    if (t in registered_handlers) {
        registered_handlers[t](msgobj, socket);
    } else {
        console.info("handlers.jservice: No handler able to handle message type ["+ t +"]");
    }
};

// TODO second argument is now a apimainhandler.ApiResponse
var handle = function(msgobj, socket) {
    try {
        handle_internal(msgobj, socket);
    } catch (err) {
        console.error(err);
    }
};

// register -------------------------------------------------------------------

// A handler is a function that takes (msgobj, socket)
var register = function(name, h) {
    registered_handlers[name] = h;
};

// Exports --------------------------------------------------------------------

module.exports = {
    init: init,
    handle: handle,
    register: register
};
