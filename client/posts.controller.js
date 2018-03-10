mainApp.controller("posts", function($scope, socket, posts_handler, rawhtml, dateutil, hash) {

    $scope.get_posts = function() {
        return posts_handler.get_displayed_posts();
    };

    $scope.format_date = function(d) {
        return dateutil.format_date_from_millis(d);
    };

    $scope.generate_post_id = function(post_index) {
        var generated_id = "post_raw_"+ $scope.$id +"_"+ post_index;

        // In the tick following that of the ID generation,
        // set the content of the element
        async.setImmediate(function() {
            var all_posts = $scope.get_posts();
            var the_post = all_posts[post_index];
            console.info("the post is " + JSON.stringify(the_post));
            rawhtml.setHTML(generated_id, the_post.body);
        });

        return generated_id;
    };

    $scope.title_click = function(post_obj) {
        var postid = post_obj.pid;
        var hashobj = ["post", postid];
        hash.set_hash(hashobj);
    };

    // Initialization ---------------------------------------------------------

    this.$onInit = function() {
        // Request posts
        console.info("Posts controller: requesting posts");
        posts_handler.init_request_posts();
    };

});
