mainApp.controller("write", function($scope, rawhtml, socket, session) {

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

        socket.register("write_preview", function(msgobj) {
            var html_str = msgobj.html;
            rawhtml.setHTML($scope.preview_id(), html_str);
        });

    };

});
