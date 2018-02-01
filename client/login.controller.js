mainApp.controller("login", function($scope, socket, login_handler) {

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

});
