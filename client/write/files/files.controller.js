mainApp.controller("write.files", function($scope, binupload, util) {

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
    }

    // ========================================================================

    self.$onInit = function() {
        binupload.register_on_upload_complete(function(file_url, file_name, id) {
            console.info("write/upload: upload complete for ["+ file_url +"] ["+ file_name +"]");
            priv.add_file(file_url, file_name, id);
        });
    }

    self.$onDestroy = function() {
        binupload.register_on_upload_complete(null);
    }

});