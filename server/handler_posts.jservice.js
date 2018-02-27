var async = require("async");

var self = {};

// handle_get_posts_page ------------------------------------------------------

var handle_posts_get_page = function(msgobj, socket) {

    // Get posts doesn't need user to be logged in

    // Get the page from db
    var page_number = msgobj.page;
    if (!self.util.is_number(page_number)) {
        return;
    }
    if (page_number < 0) {
        page_number = 0;
    }

    async.waterfall([

        // Check page number
        (callback) => {
            // Get number of pages in db
            self.db_post.count_pages((err, no_pages) => {
                if (err) {
                    callback(err);
                } else {
                    if (no_pages == 0) {
                        // No posts, send empty result
                        self.socketio.send(socket, {
                            _t: "posts_get_page",
                            page: 0,
                            posts: []
                        });
                        callback("No posts in DB");
                    } else if (page_number < no_pages) {
                        // OK, proceed
                        callback();
                    } else {
                        // Page out of bounds, re-adjust
                        page_number = no_pages - 1;
                        callback();
                    }
                }
            });
        },

        // Request data from DB
        (callback) => {
            self.db_post.get_posts_page(page_number, (err, results) => {

                if (err) {
                    callback(err);
                } else {
                    console.info("Got documents: " + JSON.stringify(results));
                    var msgobj = {
                        _t: "posts_get_page",
                        page: page_number,
                        posts: []
                    };
                    for (var i = 0; i < results.length; i++) {
                        var a_result = results[i];
                        var a_post = {};
                        a_post.created = a_result.created;
                        a_post.title = a_result.title;
                        // Render markdown body
                        a_post.body = self.markdown.render_markdown(a_result.body);
                        msgobj.posts.push(a_post);
                    }
                    self.socketio.send(socket, msgobj);
                    callback();
                }

            });
        }
    ], (err) => {
        if (err) {
            console.info(err);
        }
    });

};

// init -----------------------------------------------------------------------

module.exports.init = function(jservice) {

    self.db_post = jservice.get("db_post");
    self.socketio = jservice.get("socketio");
    self.client_session = jservice.get("client_session");
    self.util = jservice.get("util");
    self.handlers = jservice.get("handlers");
    self.markdown = jservice.get("markdown");

    self.handlers.register("posts_get_page", handle_posts_get_page);

};
