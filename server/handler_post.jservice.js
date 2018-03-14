var async = require("async");

var self = {};

// handle_post_single ---------------------------------------------------------

var handle_post_single = function(msgobj, socket) {

    // No need for authentication

    var postid = msgobj.postid;
    if (!self.util.is_string(postid)) {
        return;
    }

    // Results
    var post_document;

    async.waterfall([

        // Get the post
        (callback) => {
            self.db_post.get_post_by_id(postid, (err, doc) => {
                if (err) {
                    callback(err);
                } else {
                    post_document = doc;
                    callback();
                }
            });
        },

        // Send the result to the client
        (callback) => {
            self.ws.send(socket, {
                _t: "post_single",
                title: post_document.title,
                created: post_document.created.valueOf(),
                body: self.markdown.render_markdown(post_document.body)
            });
        }

    ], (err) => {
        if (err) {
            console.info("handler_post.jservice.js: " + err);
        }
    });

};

// init -----------------------------------------------------------------------

module.exports.init = function(jservice) {

    self.util = jservice.get("util");
    self.db_post = jservice.get("db_post");
    self.ws = jservice.get("ws");
    self.handlers = jservice.get("handlers");
    self.markdown = jservice.get("markdown");


    self.handlers.register("post_single", handle_post_single);


};
