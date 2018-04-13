// Wrapper for the global "window" object

mainApp.service("jswindow", function() {

    var self = this;

    self.get_window = function() {
        return window;
    };

    self.get_globals = function() {
        return jpress_globals;
    };

});
