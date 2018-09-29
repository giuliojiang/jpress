"use strict";

var mainApp = angular.module("mainApp", []);
mainApp.controller("mainController", function($scope) {
    $scope.d = {};
    $scope.d.writeInput = "";
    $scope.d.title = "";
    // jpress.vars.writePostId is injected by the server

    // ========================================================================
    $scope.submitButton = function() {
        var msgobj = {
            _t: "write_post",
            _tok: jpress.gsignin.token,
            title: $scope.d.title,
            body: $scope.d.writeInput,
            postid: jpress.vars.writePostId
        };
        jpress.api.communicate(msgobj, function(resp) {
            if (resp._t === "general_unauthorized") {
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
            if (resp._t === "general_unauthorized") {
                alert("Unauthorized");
            } else {
                document.getElementById("previewElement").innerHTML = resp.html;
            }
        });
    };

    var fetchPost = function() {
        console.info("Fetching existing edit post");
        var msgobj = {
            _t: "write_fetch",
            _tok: jpress.gsignin.token,
            postid: jpress.vars.writePostId
        };
        jpress.api.communicate(msgobj, function(resp) {
            if (resp._t === "post") {
                console.info("Received an existing post");
                $scope.d.title = resp.title;
                $scope.d.writeInput = resp.body;
                $scope.$apply();
            } else if (resp._t === "nopost") {
                console.info("No post received, it's a new post")
            } else {
                console.info(JSON.stringify(resp));
                alert("Unauthorized");
            }
        })
    };

    // TODO issue: this function is called before the sign in completes, so the server says that it's unauthorized.
    // If in edit-mode, fetch the existing post first
    this.$onInit = function() {
        jpress.gsignin.callWhenLoginSuccessful(fetchPost);
    };

});

angular.element(function() {
    angular.bootstrap(document, ['mainApp']);
});