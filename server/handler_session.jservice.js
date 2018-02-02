var self = {};

// handle_session_validate_token ----------------------------------------------

var handle_session_validate_token = function(msgobj, socket) {

    console.info("handler_session: handle_session_validate_token");

    var token = msgobj.token;
    if (typeof token === 'string') {
        var status = "fail";
        if (self.client_session.token_valid(token)) {
            console.info("handler_session: session is valid");
            status = "ok";
        } else {
            console.info("handler_session: session is not valid");
        }
        self.socketio.send(socket, {
            _t: "session_validate_token",
            status: status
        });
    }

};

// handle_session_end ---------------------------------------------------------

var handle_session_end = function(msgobj, socket) {

    self.client_session.end_session();
    self.socketio.send(socket, {
        _t: "session_validate_token",
        status: "fail"
    });

};

// init -----------------------------------------------------------------------

module.exports.init = function(jservice) {

    self.handlers = jservice.get("handlers");
    self.client_session = jservice.get("client_session");
    self.socketio = jservice.get("socketio");

    self.handlers.register("session_validate_token", handle_session_validate_token);
    self.handlers.register("session_end", handle_session_end);
};
