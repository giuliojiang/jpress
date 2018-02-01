mainApp.controller("navbar", function($scope, switcher, session) {

    $scope.logged_in = function() {
        return session.is_validated();
    };

});
