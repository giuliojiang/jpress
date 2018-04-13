mainApp.service("write_data", function(socket, rawhtml, switcher, $rootScope, alert, util, jswindow, hash) {

    var self = this;

    var preview_id;

    // write_preview handler --------------------------------------------------
    socket.register("write_preview", function(msgobj) {
        var html_str = msgobj.html;
        rawhtml.setHTML(preview_id, html_str);
    });

    // write_submit handler ---------------------------------------------------
    socket.register("write_submit", function(msgobj) {
        hash.set_hash(["posts", 0]);
        $rootScope.$apply();
        alert.alert("Post submitted");
    });

    // set_preview_id ---------------------------------------------------------
    this.set_preview_id = function(new_preview_id) {
        preview_id = new_preview_id;
    };

    // ========================================================================
    self.insert_text = function(text) {
        util.textarea_insert("jpress_write_textarea", text);
        async.setImmediate(function() {
            $rootScope.$apply();
        });
    };

    // ========================================================================
    self.get_text = function() {
        return jswindow.get_window().document.getElementById("jpress_write_textarea").value;
    };

});
