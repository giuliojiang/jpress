mainApp.service('session', function(socket, $rootScope) {

    var self = this;
    var d = {};
    // token

    // set_token --------------------------------------------------------------

    this.set_token = function(new_token) {
        d.token = new_token;
        localStorage.token = new_token;
    };

    // get_token --------------------------------------------------------------

    this.get_token = function() {
        return d.token;
    };

    // clear_token ------------------------------------------------------------

    this.clear_token = function() {
        self.set_token(null);
    };

    // is_validated -----------------------------------------------------------

    this.is_validated = function() {
        return !!d.token;
    };

    // init -------------------------------------------------------------------

    var init = function() {
        var token = localStorage.token;

        // Register token validation handler
        socket.register("session_validate_token", function(msgobj) {
            console.info("session: received " + JSON.stringify(msgobj));
            var status = msgobj.status;
            if (status == "ok") {
                // Set token status
                console.info("session: token valid");
                self.set_token(token);
                $rootScope.$apply();
            } else {
                console.info("session: token rejected. Clearing tokens");
                self.clear_token();
                $rootScope.$apply();
            }
        });

        // Request token validation
        if (token) {
            socket.send({
                _t: "session_validate_token",
                token: token
            });
        }
    };
    init();

});
