"use strict";

var mainApp = angular.module("mainApp", []);
mainApp.controller("mainController", function($scope) {
    $scope.d = {};
    $scope.d.writeInput = "";
    $scope.d.title = "";

    // ========================================================================
    $scope.submitButton = function() {
        var msgobj = {
            _t: "write_post",
            _tok: jpress.gsignin.token,
            title: $scope.d.title,
            body: $scope.d.writeInput
        };
        jpress.api.communicate(msgobj, function(resp) {
            if (resp._t == "general_unauthorized") {
                alert("Unauthorized");
                return;
            }
            var status = resp.status;
            if (status) {
                console.info("Post successful");
            } else {
                console.info("Post failed!");
            }
        });
    };

    // ========================================================================
    $scope.previewButton = function() {
        var msgobj = {
            _t: "write_preview",
            _tok: jpress.gsignin.token,
            text: $scope.d.writeInput
        };
        jpress.api.communicate(msgobj, function(resp) {
            if (resp._t == "general_unauthorized") {
                alert("Unauthorized");
            } else {
                var htmlString = resp.html;
                document.getElementById("previewElement").innerHTML = htmlString;
            }
        });
    };

    $scope.signout = function() {
        jpress.gsignin.signOut();
    };
});

angular.element(function() {
    angular.bootstrap(document, ['mainApp']);
});