mainApp.service("write_data", function(socket, rawhtml) {

    var self = this;

    var preview_id;

    // write_preview handler --------------------------------------------------
    socket.register("write_preview", function(msgobj) {
        var html_str = msgobj.html;
        rawhtml.setHTML(preview_id, html_str);
    });

    // set_preview_id ---------------------------------------------------------
    this.set_preview_id = function(new_preview_id) {
        preview_id = new_preview_id;
    };

});
