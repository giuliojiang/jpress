"use strict";

var mainApp = angular.module("mainApp", []);
mainApp.controller("mainController", function($scope) {
    $scope.d = {};
    $scope.d.posts = []
    $scope.d.editId = "";
    $scope.d.deleteId = "";
    $scope.d.loggedIn = false; // Becomes true only if user is logged in AND admin
    $scope.d.errorMsg = "";

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

    this.$onInit = function() {
        var intervalHandle = setInterval(function() {
            console.info("Checking gsignin token...");
            if (jpress.gsignin.token) {
                // Found a token!
                clearInterval(intervalHandle);
                jpress.api.communicate({
                    _t: "panel_login",
                    _tok: jpress.gsignin.token
                }, function(msgobj) {
                    var t = msgobj._t;
                    if (t == "panel_login") {
                        // Login success
                        $scope.d.loggedIn = true;
                        $scope.$apply();
                    } else if (t == "general_unauthorized") {
                        // Unauthorized
                        $scope.d.errorMsg = "Unauthorized";
                        $scope.$apply();
                    }
                });
            } else {
                // No token
                console.info("No token found");
            }
        }, 250);
    };
});

angular.element(function() {
    angular.bootstrap(document, ['mainApp']);
});
