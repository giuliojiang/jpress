mainApp.service('posts_handler', function(socket, session) {

    var self = this;

    var current_page = 0;
    var displayed_posts = [];

    // Initialization ---------------------------------------------------------
    self.init_request_posts = function() {
        socket.send({
            _t: "posts_get_page",
            page: current_page
        });
    };

    // Get current page -------------------------------------------------------
    self.get_current_page = function() {
        return current_page;
    };

    // Get displayed posts ----------------------------------------------------
    self.get_displayed_posts = function() {
        return displayed_posts;
    };

    // posts_get_page handler -------------------------------------------------
    self.posts_get_page_handler = function(msgobj) {
        console.info("posts_get_page_handler received " + JSON.stringify(msgobj));
        current_page = msgobj.page;
        displayed_posts = msgobj.posts;
        // TODO display the posts
    };

    // Handlers registration --------------------------------------------------
    socket.register("posts_get_page", self.posts_get_page_handler);

});
