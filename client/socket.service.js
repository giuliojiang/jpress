mainApp.service('socket', function() {

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

//         var theHandler = this.handlers[t];
//         if (!theHandler) {
//             console.error("No handler registered for message type ["+t+"] and message["+JSON.stringify(msgobj)+"]");
//             return;
//         }
//
//         theHandler(msgobj);
    });

    this.send = function(msgobj) {
        socket.emit("jpress_txt", msgobj);
    };
});
