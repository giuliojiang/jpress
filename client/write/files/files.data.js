mainApp.service("write_files_data", function(util) {

    var self = this;

    // Each file is an object {name, url, is_image, id}
    var files = [];

    // ========================================================================

    self.get_files_id_list = function() {
        var result = [];
        for (var i = 0; i < files.length; i++) {
            result.push(files[i].id)
        }
        return result;
    };

    // ========================================================================

    self.add_file = function(url, name, id) {
        var is_image = util.is_image_name(name);
        var fileobj = {
            name: name,
            url: url,
            is_image: is_image,
            id: id
        };
        files.push(fileobj);
    }

    // ========================================================================

    self.get_files = function() {
        return files;
    }

});