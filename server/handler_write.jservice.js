var self = {};

// handle_write_preview -------------------------------------------------------

var handle_write_preview = function(msgobj, socket) {

};

// init -----------------------------------------------------------------------

module.exports.init = function(jservice) {

    self.handlers = jservice.get("handlers");
    self.socketio = jservice.get("socketio");

    self.handlers.register("write_preview", handle_write_preview);

};
