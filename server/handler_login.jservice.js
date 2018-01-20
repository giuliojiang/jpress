var handlers;
var client_session;

// handle_login_login ---------------------------------------------------------

var handle_login_login = function(msgobj, socket) {
    console.info("handler_login.jservice: Received: " + JSON.stringify(msgobj));
};

// init -----------------------------------------------------------------------

var init = function(jservice) {
    handlers = jservice.get("handlers");
    client_session = jservice.get("client_session");

    handlers.register("login_login", handle_login_login);
};

// Exports --------------------------------------------------------------------

module.exports = {
    init: init
};
