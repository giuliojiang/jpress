mainApp.service('login_handler', function(socket) {

    // login_feedback_handler -------------------------------------------------

    var login_feedback_handler = function(msgobj) {
        console.info("login_feedback_handler: got " + JSON.stringify(msgobj));
    };

    socket.register("login_login", login_feedback_handler);

});
