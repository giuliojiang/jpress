mainApp.service("post_handler", function(hash, socket) {

    var self = this;

    var post_title;
    var post_created;
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

    // ========================================================================
    // Initialization

    register_hash_handler();

});
