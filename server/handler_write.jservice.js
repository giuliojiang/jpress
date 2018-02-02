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

// init -----------------------------------------------------------------------

module.exports.init = function(jservice) {

    self.handlers = jservice.get("handlers");
    self.socketio = jservice.get("socketio");
    self.client_session = jservice.get("client_session");
    self.markdown = jservice.get("markdown");

    self.handlers.register("write_preview", handle_write_preview);

};
