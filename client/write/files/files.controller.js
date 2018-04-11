mainApp.controller("write.files", function($scope, binupload, write_files_data, write_data) {

    var self = this;

    var priv = {};

    // ========================================================================

    priv.add_file = function(url, name, id) {
        write_files_data.add_file(url, name, id);
        $scope.$apply();
    };

    // ========================================================================

    // <a_file> is an object from $scope.d.files
    $scope.add_as_image = function(a_file) {
        // Markdown image+link format
        // [![](url)](url)
        var file_url = a_file.url;
        var md_code = "[!["+ a_file.name +"]("+ file_url +")]("+ file_url +")";
        write_data.insert_text(md_code);
    };

    $scope.add_as_link = function(a_file) {
        // Markdown link format
        // [GitHub](http://github.com)
        var md_code = "["+ a_file.name +"]("+ a_file.url +")";
        write_data.insert_text(md_code);
    }

    $scope.get_files = function() {
        return write_files_data.get_files();
    }

    // ========================================================================

    self.$onInit = function() {
        binupload.register_on_upload_complete(function(file_url, file_name, id) {
            console.info("write/upload: upload complete for ["+ file_url +"] ["+ file_name +"]");
            priv.add_file(file_url, file_name, id);
        });
    };

    self.$onDestroy = function() {
        binupload.register_on_upload_complete(null);
    };

});