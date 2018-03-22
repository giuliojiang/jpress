var self = {};
const WebSocket = require("ws");

var ws_server;

var curr_id = 0;

module.exports.init = function(jservice) {

    self.https_server = jservice.get("https_server");
    self.handlers = jservice.get("handlers");

    ws_server = new WebSocket.Server({
        server: self.https_server.get_https_server()
    });

    ws_server.on("connection", function(socket) {
        // Generate an ID for the new connection
        curr_id += 1;
        socket.id = curr_id;
        console.info("New WS connection. ID ["+socket.id+"]");

        socket.on("message", function(message) {
            var msgobj = JSON.parse(message);
            self.handlers.handle(msgobj, socket);
        });
    });

};

module.exports.send = function(socket, msgobj) {
    socket.send(JSON.stringify(msgobj));
};

module.exports.alert = function(socket, txt) {
    socket.send(JSON.stringify({
        _t: "alert",
        txt: txt
    }));
};
