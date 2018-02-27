mainApp.service('posts_handler', function(socket, session) {

    var self = this;

    var current_page = 0;

    // Initialization
    self.init_request_posts = function() {
        socket.send({
            _t: "posts_get_page",
            token: session.get_token(),
            page: current_page
        });
    };

    // ??? handler















    // login_feedback_handler -------------------------------------------------

    var login_feedback_handler = function(msgobj) {
        console.info("login_feedback_handler: got " + JSON.stringify(msgobj));
        session.set_token(msgobj.token);
        switcher.show("posts");
        $rootScope.$apply();
    };

    socket.register("login_login", login_feedback_handler);

});
