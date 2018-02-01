var self = {};

// handle_get_posts_page ------------------------------------------------------

var handle_posts_get_page = function(msgobj, socket) {

    // Check token validity
    if (!self.client_session.token_valid(msgobj.token)) {
        return;
    }

    // Get the page from db
    var page_number = msgobj.page;
    if (!self.util.is_number(page_number)) {
        return;
    }
    if (page_number < 0) {
        return;
    }
    self.db_post.get_posts_page(page_number, (err, results) => {

        if (err) {
            console.error(err);
            return;
        } else {
            console.info("Got documents: " + JSON.stringify(results));
            return;
            // TODO send the documents to the client
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

    self.handlers.register("posts_get_page", handle_posts_get_page);

};
