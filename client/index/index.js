"use strict";

var mainApp = angular.module("mainApp", []);
mainApp.controller("mainController", function($scope) {
    $scope.d = {};
});

angular.element(function() {
    angular.bootstrap(document, ['mainApp']);
});
