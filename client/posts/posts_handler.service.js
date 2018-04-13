mainApp.service('posts_handler', function(socket, session, $rootScope, hash) {

    var self = this;
    var priv = {};

    var current_page = 0;
    // each post object has: created, title, body
    var displayed_posts = null;

    // Get page by page number ------------------------------------------------
    // [private]
    var get_page_number = function(page_index) {
        console.info("posts_handler.service.js:get_page_number " + page_index);
        // Trigger a hash change
        // And wait for the return event to set the actual page
        hash.set_hash([
            "posts",
            page_index
        ]);
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
        current_page = msgobj.page;
        displayed_posts = msgobj.posts;
        $rootScope.$apply();
    };

    // Handlers registration --------------------------------------------------
    
    priv.init = function() {
        socket.register("posts_get_page", self.posts_get_page_handler);

        hash.register("posts", function(hash_component) {
            var pageno = hash_component[1];
            console.info("got hash change, page " + pageno);
            socket.send({
                _t: "posts_get_page",
                page: pageno
            });
        });
    }

    priv.init();

});
