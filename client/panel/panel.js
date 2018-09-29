"use strict";

var mainApp = angular.module("mainApp", []);
mainApp.controller("mainController", function($scope) {
    $scope.d = {};
    $scope.d.posts = [];
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
        jpress.main.gotoRelative("/write/" + $scope.d.editId);
    };

    $scope.deleteByIdClick = function() {
        console.info("deleteByIdClick()");
        var msgobj = {
            _t: "panel_delete_by_id",
            _tok: jpress.gsignin.token,
            postid: $scope.d.deleteId
        };
        jpress.api.communicate(msgobj, function(resp) {
            if (resp.status === "ok") {
                alert("Post deleted");
            } else if (resp.status === "fail") {
                alert("Error: post not found");
            } else {
                alert("Unauthorized")
            }
        });
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
                    if (t === "panel_login") {
                        // Login success
                        $scope.d.loggedIn = true;
                        $scope.$apply();
                    } else if (t === "general_unauthorized") {
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
