"use strict";

var mainApp = angular.module("mainApp", []);
mainApp.controller("mainController", function($scope) {
    $scope.d = {};

    $scope.morePosts = function() {
        console.info("More posts button pressed");
    };
});

angular.element(function() {
    angular.bootstrap(document, ['mainApp']);
});
