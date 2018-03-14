var handlers;
var client_session;
var config;
var password_service;
var ws;
var timeout_service;
var client_session;

// Data -----------------------------------------------------------------------

var quarantine_clients = {};

// handle_login_login ---------------------------------------------------------

var login_failed = function(socket) {
    // Send login failed message
    ws.send(socket, {
        _t: "login_login",
        status: "fail"
    });

    // Add to a 10s quarantine
    quarantine_clients[socket.id] = true;
    timeout_service.set(() => {
        delete quarantine_clients[socket.id];
    }, 10 * 1000);
};

var login_success = function(socket) {
    // Start new session
    var tok = client_session.start_session();

    // Send message
    ws.send(socket, {
        _t: "login_login",
        status: "ok",
        token: tok
    });

};

var handle_login_login = function(msgobj, socket) {
    // This user has a failed attempt. Throttling...
    if (socket.id in quarantine_clients) {
        return;
    }

    // Check login credentials
    var user = msgobj.user;
    var pass = msgobj.pass;
    var passhash = config.vals.passhash;
    var reguser = config.vals.user;

    if (user != reguser) {
        login_failed(socket);
    } else if (!password_service.verify(pass, passhash)) {
        login_failed(socket);
    } else {
        login_success(socket);
    }
};

// init -----------------------------------------------------------------------

var init = function(jservice) {
    handlers = jservice.get("handlers");
    client_session = jservice.get("client_session");
    config = jservice.get("config");
    password_service = jservice.get("password");
    ws = jservice.get("ws");
    timeout_service = jservice.get("timeout");
    client_session = jservice.get("client_session");

    handlers.register("login_login", handle_login_login);
};

// Exports --------------------------------------------------------------------

module.exports = {
    init: init
};
