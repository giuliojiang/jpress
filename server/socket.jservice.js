var socketio;
var https_server;
var handlers;

// init -----------------------------------------------------------------------

var init = function(jservice) {
    socketio = jservice.get("socketio");
    https_server = jservice.get("https_server");
    handlers = jservice.get("handlers");
};

// start ----------------------------------------------------------------------

var start = function() {
    socketio.on("connection", function(socket) {
        console.info("A client connected " + socket);

        // Disconnect handler
        socket.on("disconnect", function() {
            console.info("A client disconnected " + socket);
        });

        // Message handler
        socket.on("jpress_txt", function(msgobj) {
            handlers.handle(msgobj, socket);
        });
    });

    socketio.listen(https_server.get_https_server());
    console.info("socket.jservice: Started");
};

// Exports --------------------------------------------------------------------

module.exports = {
    init: init,
    start: start
};
