"use strict";

var mainApp = angular.module("mainApp", []);
mainApp.controller("mainController", function($scope) {
    $scope.d = {};
    $scope.d.posts = []
    $scope.editId = "";
    $scope.DeleteId = "";

    $scope.editClick = function(post) {
        console.info("editClick()");
    };

    $scope.deleteClick = function(post) {
        console.info("deleteClick()");
    };

    $scope.editByIdClick = function() {
        console.info("editByIdClick()");
    };

    $scope.deleteByIdClick = function() {
        console.info("deleteByIdClick()");
    };
});

angular.element(function() {
    angular.bootstrap(document, ['mainApp']);
});
