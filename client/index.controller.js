var mainApp = angular.module("mainApp", []);

mainApp.controller("main_controller", function($scope, switcher, alert) {

    // Main view --------------------------------------------------------------

    $scope.main_view_switch = function(new_view) {
        switcher.show(new_view);
    };

    $scope.is_active = function(name) {
        return switcher.is_active(name);
    };

});

mainApp.config(function($locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
});
