mainApp.controller("write", function($scope, socket, session, write_data, write_files_data, hash) {

    $scope.d = {};
    // title

    // ------------------------------------------------------------------------

    $scope.preview = function() {
        socket.send({
            _t: "write_preview",
            txt: write_data.get_text(),
            token: session.get_token()
        });
    };

    $scope.preview_id = function() {
        return "write_preview_" + $scope.$id;
    };

    $scope.submit = function() {
        socket.send({
            _t: "write_submit",
            txt: write_data.get_text(),
            token: session.get_token(),
            title: $scope.d.title,
            files: write_files_data.get_files_id_list()
        });
    };

    // init -------------------------------------------------------------------

    this.$onInit = function() {
        console.info("write: $onInit");
        hash.set_hash(["write"]);
        write_data.set_preview_id($scope.preview_id());
    };

});
