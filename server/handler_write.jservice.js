var async = require("async");

var self = {};

// handle_write_preview -------------------------------------------------------

var handle_write_preview = function(msgobj, socket) {

    console.info("handler_write: handle_write_preview");

    if (!self.client_session.token_valid(msgobj.token)) {
        console.info("handler_write: session not valid");
        return;
    }

    var txt = msgobj.txt;
    if (!(typeof txt === 'string')) {
        console.info("handler_write: msgobj.txt not valid");
        return;
    }

    var rendered = self.markdown.render_markdown(txt);
    console.info("handler_write: rendered " + rendered);
    self.socketio.send(socket, {
        _t: "write_preview",
        html: rendered
    });

};

// handle_write_submit --------------------------------------------------------

var handle_write_submit = function(msgobj, socket) {
    var token = msgobj.token;
    var title = msgobj.title;
    var txt = msgobj.txt;

    if (!self.client_session.token_valid(token)) {
        self.socketio.alert(socket, "Invalid session. Please refresh");
        return;
    };

    if (!(typeof txt === 'string')) {
        self.socketio.alert(socket, "Invalid post body");
        return;
    }

    if (txt == "") {
        self.socketio.alert(socket, "Post body cannot be empty");
        return;
    }

    if (!(typeof title === 'string')) {
        self.socketio.alert(socket, "Invalid post title");
        return;
    }

    if (title == "") {
        self.socketio.alert(socket, "Post title cannot be empty");
        return;
    }

    async.waterfall([

        // Insert in database
        (callback) => {
            self.db_post.new_post(title, txt, callback);
        }

    ], (err) => {
        if (err) {
            console.info("handler_write: An error occurred when inserting a post in the database: " + err);
            self.socketio.alert(socket, "An error occurred when saving your post");
        } else {
            // Send confirmation of success to the client
            self.socketio.send(socket, {
                _t: "write_submit"
            });
        }
    });

};

// init -----------------------------------------------------------------------

module.exports.init = function(jservice) {

    self.handlers = jservice.get("handlers");
    self.socketio = jservice.get("socketio");
    self.client_session = jservice.get("client_session");
    self.markdown = jservice.get("markdown");
    self.db_post = jservice.get("db_post");

    self.handlers.register("write_preview", handle_write_preview);
    self.handlers.register("write_submit", handle_write_submit);

};
