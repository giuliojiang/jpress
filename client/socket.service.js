mainApp.service('socket', function() {

    // Handlers ---------------------------------------------------------------

    var handlers = {};

    // A handler is a func(msgobj)
    this.register = function(t, func) {
        handlers[t] = func;
    };

    // Connection -------------------------------------------------------------

    // Connect to server
    var socket = io("https://"+ window.location.hostname +":21555", {secure: true});

    socket.on("connect", () => {
        console.info("Socket.io connected");
    });

    socket.on("jpress_txt", (msgobj) => {
        var t = msgobj._t;
        if (!t) {
            console.error("No field _t in message!");
            return;
        }

        console.info("Received message from server: " + JSON.stringify(msgobj));

        var the_handler = handlers[t];
        if (!the_handler) {
            console.error("No handler for type ["+ t +"]");
        } else {
            the_handler(msgobj);
        }
    });

    this.send = function(msgobj) {
        socket.emit("jpress_txt", msgobj);
    };


});
