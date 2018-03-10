mainApp.service("dateutil", function() {

    var self = this;

    self.format_date_from_millis = function(date_millis) {
        var d = new Date(date_millis);
        return d.toLocaleDateString();
    };

});
