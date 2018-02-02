mainApp.controller("write", function($scope, rawhtml, socket) {

    $scope.d = {};
    // title
    // text

    // ------------------------------------------------------------------------

    $scope.preview = function() {
        socket.send({
            _t: "write_preview",
            txt: $scope.d.text
        });
    };

    $scope.preview_id = function() {
        return "write_preview_" + $scope.$id;
    };

    // init -------------------------------------------------------------------

    this.$onInit = function() {

        socket.register("write_preview", function(msgobj) {
            var html_str = msgobj.html;
            rawhtml.setHTML($scope.preview_id(), html_str);
        });

    };

});
