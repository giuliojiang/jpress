mainApp.controller("login", function($scope, socket) {

    $scope.username = null;
    $scope.password = null;

    $scope.login = function() {
        socket.send({
            _t: "login_login",
            user: $scope.username,
            pass: $scope.password
        });
    };

    $scope.login_key = function(code) {
        if (code == 13) {
            $scope.login();
        }
    };

    // Handlers ---------------------------------------------------------------

    var login_feedback_handler = function(msgobj) {
        console.info("login_feedback_handler: got " + JSON.stringify(msgobj));
    };

    socket.register("login_login", login_feedback_handler);

});
