var io;

// init -----------------------------------------------------------------------

var init = function(jservice) {
    io = require("socket.io")();
};

// on -------------------------------------------------------------------------

var on = function(event_type, handler) {
    io.on(event_type, handler);
};

// listen ---------------------------------------------------------------------

var listen = function(server) {
    io.listen(server);
};

// send -----------------------------------------------------------------------

var send = function(socket, msgobj) {
    socket.emit("jpress_txt", msgobj);
};

// Exports --------------------------------------------------------------------

module.exports = {
    init: init,
    on: on,
    listen: listen,
    send: send
};
