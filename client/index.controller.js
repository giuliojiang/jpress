var mainApp = angular.module("mainApp", []);

mainApp.controller("main_controller", function($scope) {

    // Main view --------------------------------------------------------------

    $scope.main_view = 'posts'; // Can be posts, write, login, post

    $scope.main_view_switch = function(new_view) {
        $scope.main_view = new_view;
    };


});
