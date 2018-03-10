mainApp.controller("post", function($scope, post_handler, rawhtml) {

    $scope.get_title = function() {
        return post_handler.get_title();
    };

    $scope.get_created = function() {
        return post_handler.get_created();
    };

    $scope.get_rawhtml_id = function() {
        var gen_id = "post_" + $scope.$id + "_rawhtml"

        async.setImmediate(function() {
            rawhtml.setHTML(gen_id, post_handler.get_body());
        });

        return gen_id;
    };

});
