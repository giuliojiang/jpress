mainApp.controller("write.upload", function($scope, binupload) {

    var self = this;
    var priv = {};

    $scope.select_file = function() {
        binupload.upload_start_select_file();
    };

});
