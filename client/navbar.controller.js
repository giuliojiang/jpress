mainApp.controller("navbar", function($scope, switcher, session, socket) {

    $scope.logged_in = function() {
        return session.is_validated();
    };

    $scope.logout = function() {
        socket.send({
            _t: "session_end"
        });
        switcher.show("login");
    };

});
