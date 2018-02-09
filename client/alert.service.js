mainApp.service("alert", function(socket) {

    var self = this;

    // alert ------------------------------------------------------------------
    self.alert = function(txt) {
        Materialize.toast(txt, 4000);
    };

    // alert handler ----------------------------------------------------------
    socket.register("alert", function(msgobj) {
        self.alert(msgobj.txt);
    });

});
