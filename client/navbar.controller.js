mainApp.controller("navbar", function($scope, switcher, session, socket, hash, jswindow) {

    $scope.logged_in = function() {
        return session.is_validated();
    };

    $scope.logout = function() {
        socket.send({
            _t: "session_end",
            token: session.get_token()
        });
        switcher.show("login");
    };

    $scope.to_posts = function() {
        hash.set_hash(["posts", 0]);
    };

    $scope.get_blog_title = function() {
        return jswindow.get_globals().title;
    };

});
