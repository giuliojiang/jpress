mainApp.service("util", function() {

    var self = this;

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

});
