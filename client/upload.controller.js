mainApp.controller("upload", function($scope, binupload) {

    $scope.select_file = function() {
        binupload.upload_start_select_file();
    };

});
