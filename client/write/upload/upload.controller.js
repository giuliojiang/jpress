mainApp.controller("write.upload", function($scope, binupload) {

    var self = this;
    var priv = {};

    priv.init = function() {
        binupload.register_on_upload_complete(function(file_url, file_name) {
            console.info("write/upload: upload complete for ["+ file_url +"] ["+ file_name +"]");
        });
    }

    $scope.select_file = function() {
        binupload.upload_start_select_file();
    };

    // init ===================================================================

    self.$onInit = function() {
        priv.init();
    }

    // destroy ================================================================

    self.$onDestroy = function() {
        binupload.register_on_upload_complete(null);
    }

});
