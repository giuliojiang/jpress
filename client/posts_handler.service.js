mainApp.service('posts_handler', function(socket, session, $rootScope) {

    var self = this;

    var current_page = 0;
    // each post object has: created, title, body
    var displayed_posts = [];

    // Get page by page number ------------------------------------------------
    // [private]
    var get_page_number = function(page_index) {
        socket.send({
            _t: "posts_get_page",
            page: page_index
        });
    };

    // Initialization ---------------------------------------------------------
    self.init_request_posts = function() {
        get_page_number(current_page);
    };

    // Get current page -------------------------------------------------------
    self.get_current_page = function() {
        return current_page;
    };

    // Get displayed posts ----------------------------------------------------
    self.get_displayed_posts = function() {
        return displayed_posts;
    };

    // Next page --------------------------------------------------------------
    self.next_page = function() {
        get_page_number(current_page + 1);
    };

    // Previous page ----------------------------------------------------------
    self.previous_page = function() {
        get_page_number(current_page - 1);
    };

    // Go to page -------------------------------------------------------------
    self.go_to_page = function(page_no) {
        get_page_number(page_no - 1);
    };

    // posts_get_page handler -------------------------------------------------
    self.posts_get_page_handler = function(msgobj) {
        console.info("posts_get_page_handler received " + JSON.stringify(msgobj));
        current_page = msgobj.page;
        displayed_posts = msgobj.posts;
        $rootScope.$apply();
    };

    // Handlers registration --------------------------------------------------
    socket.register("posts_get_page", self.posts_get_page_handler);

});
