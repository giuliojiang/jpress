mainApp.service("post_handler", function(hash, socket, dateutil, $rootScope, rawhtml) {

    var self = this;

    var post_title;
    var post_created; // date and time in millis from epoch
    var post_html;

    // ========================================================================
    // Private methods

    // Register hash handler
    var register_hash_handler = function() {
        hash.register("post", function(hash_arr) {
            var post_id = hash_arr[1];
            // Request from server the post
            socket.send({
                _t: "post_single",
                postid: post_id
            });
        });
    };

    self.post_single_handler = function(msgobj) {
        console.info("post_handler.service. Received " + JSON.stringify(msgobj));
        post_title = msgobj.title;
        post_created = msgobj.created;
        post_html = msgobj.body;
        $rootScope.$apply();
        // The body element is set automatically when get_rawhtml_id() is triggered
    };

    // ========================================================================
    // Public methods

    self.get_title = function() {
        return post_title;
    };

    self.get_created = function() {
        return dateutil.format_date_from_millis(post_created);
    };

    self.get_body = function() {
        return post_html;
    };

    // ========================================================================
    // Initialization

    register_hash_handler();
    socket.register("post_single", self.post_single_handler);

});
