mainApp.controller("posts", function($scope, socket, posts_handler) {

    $scope.test = "test success";

    $scope.btntest = function() {
        socket.send({
            _t: "yoyuo",
            tosjhpoif: "ofpiji"
        });
    };

    // Initialization ---------------------------------------------------------

    this.$onInit = function() {
        // Request posts
        console.info("Posts controller: requesting posts");
        posts_handler.init_request_posts();
    };

});
