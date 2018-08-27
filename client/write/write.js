"use strict";

var mainApp = angular.module("mainApp", []);
mainApp.controller("mainController", function($scope) {
    $scope.d = {};
    $scope.d.writeInput = "";

    $scope.submitButton = function() {
        console.info("Submit button clicked");
    };

    $scope.previewButton = function() {
        var msgobj = {
            _t: "write_preview",
            _tok: jpress.gsignin.token,
            text: $scope.d.writeInput
        };
        jpress.api.communicate(msgobj, function(resp) {
            var htmlString = resp.html;
            document.getElementById("previewElement").innerHTML = htmlString;
        });
    };

    $scope.signout = function() {
        jpress.gsignin.signOut();
    };
});

angular.element(function() {
    angular.bootstrap(document, ['mainApp']);
});