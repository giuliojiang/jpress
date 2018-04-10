mainApp.service("util", function(jswindow) {

    var self = this;

    // ========================================================================
    // Given a file name, determines whether it's an image from the
    // extension
    self.is_image_name = function(fname) {
        var valid_extensions = {
            "jpg": 1,
            "png": 1,
            "jpeg": 1,
            "gif": 1
        };

        var fname_split = fname.split(".");
        if (fname_split.length >= 2) {
            var extension = fname_split[fname_split.length - 1];
            return extension in valid_extensions;
        } else {
            return false;
        }
    }

    // ========================================================================
    // Insert text in textarea at current cursor position
    // Source: http://alexking.org/blog/2003/06/02/inserting-at-the-cursor-using-javascript/
    self.textarea_insert = function(field_id, new_value) {
        var text_field = jswindow.get_window().document.getElementById(field_id);
        if (!text_field) {
            console.error("No element with ID " + field_id);
            return;
        }
        //IE support
        if (document.selection) {
            text_field.focus();
            sel = document.selection.createRange();
            sel.text = new_value;
        }
        //MOZILLA/NETSCAPE support
        else if (text_field.selectionStart || text_field.selectionStart == '0') {
            var startPos = text_field.selectionStart;
            var endPos = text_field.selectionEnd;
            text_field.value = text_field.value.substring(0, startPos)
            + new_value
            + text_field.value.substring(endPos, text_field.value.length);
        } else {
            text_field.value += new_value;
        }
    }

});
