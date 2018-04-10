mainApp.controller("write.files", function($scope, binupload, util, write_data) {

    var self = this;

    var priv = {};

    // files: list of files uploaded
    //        Each file is an object {name, url, is_image, id}
    $scope.d = {};
    $scope.d.files = [];

    // ========================================================================

    priv.add_file = function(url, name, id) {
        var is_image = util.is_image_name(name);
        var fileobj = {
            name: name,
            url: url,
            is_image: is_image, 
            id: id
        };
        $scope.d.files.push(fileobj);
        $scope.$apply();
        console.info("Now d.files is: " + JSON.stringify($scope.d.files));
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