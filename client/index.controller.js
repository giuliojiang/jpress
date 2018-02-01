var mainApp = angular.module("mainApp", []);

mainApp.controller("main_controller", function($scope, switcher) {

    // Main view --------------------------------------------------------------

    $scope.main_view_switch = function(new_view) {
        switcher.show(new_view);
    };

    $scope.is_active = function(name) {
        return switcher.is_active(name);
    };

});
