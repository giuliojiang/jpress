"use strict";

// Load other scripts
{
    var e = document.createElement("script");
    e.src = BASEURL + "/lib/api.js";
    document.head.appendChild(e);
}

var mainApp = angular.module("mainApp", []);
mainApp.controller("mainController", function($scope) {
    $scope.d = {};
    $scope.d.writeInput = "";

    $scope.submitButton = function() {
        console.info("Submit button clicked");
    };

    $scope.previewButton = function() {
        console.info("Preview button clicked");
        var msgobj = {
            _t: "write_preview",
            text: "some text"
        };
        jpress.api.communicate(msgobj, function(resp) {
            console.info("Response is " + JSON.stringify(resp));
        });
    };
});