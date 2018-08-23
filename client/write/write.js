"use strict";

var mainApp = angular.module("mainApp", []);
mainApp.controller("mainController", function($scope) {
    $scope.d = {};
    $scope.d.writeInput = "";

    $scope.submitButton = function() {
        console.info("Submit button clicked");
    };

    $scope.previewButton = function() {
        console.info("Preview button clicked");
    };
});