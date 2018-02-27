mainApp.service('switcher', function($rootScope) {

    // Known views: posts, write, login, post

    var d = {
        current: "posts"
    };

    // show -------------------------------------------------------------------

    this.show = function(view_name) {
        console.info("switcher: showing " + view_name);
        d.current = view_name;
    };

    // get_current ------------------------------------------------------------

    this.get_current = function() {
        return d.current;
    };

    // is_active --------------------------------------------------------------

    this.is_active = function(view) {
        return d.current == view;
    };

});
