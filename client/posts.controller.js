mainApp.controller("posts", function($scope, socket) {

    $scope.test = "test success";

    $scope.btntest = function() {
        socket.send({
            _t: "yoyuo",
            tosjhpoif: "ofpiji"
        });
    };

});
