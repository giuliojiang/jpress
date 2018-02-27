mainApp.controller("posts", function($scope, socket, posts_handler) {

    $scope.test = "test success";

    $scope.btntest = function() {
        socket.send({
            _t: "yoyuo",
            tosjhpoif: "ofpiji"
        });
    };

    // Initialization ---------------------------------------------------------

    $scope.ngOnInit = function() {
        // Request posts
        posts_handler.init_request_posts();
    };

});
