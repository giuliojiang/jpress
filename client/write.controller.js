mainApp.controller("write", function($scope, socket, session, write_data) {

    $scope.d = {};
    // title
    // text

    // ------------------------------------------------------------------------

    $scope.preview = function() {
        socket.send({
            _t: "write_preview",
            txt: $scope.d.text,
            token: session.get_token()
        });
    };

    $scope.preview_id = function() {
        return "write_preview_" + $scope.$id;
    };

    // init -------------------------------------------------------------------

    this.$onInit = function() {
        console.info("write: $onInit");
        write_data.set_preview_id($scope.preview_id());
    };

});
