mainApp.service('login_handler', function(socket, session, $rootScope, switcher, hash) {

    // login_feedback_handler -------------------------------------------------

    var login_feedback_handler = function(msgobj) {
        console.info("login_feedback_handler: got " + JSON.stringify(msgobj));
        session.set_token(msgobj.token);
        hash.set_hash(["posts", 0]);
        $rootScope.$apply();
    };

    socket.register("login_login", login_feedback_handler);

});
