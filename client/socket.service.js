mainApp.service('socket', function(jswindow, $timeout) {

    var self = this;

    var ws = null;
    var pending_messages = [];

    // Handlers ---------------------------------------------------------------

    var handlers = {};

    // A handler is a func(msgobj)
    this.register = function(t, func) {
        handlers[t] = func;
    };

    self.get_endpoint = function() {
        return jswindow.get_window().location.hostname +":21555";
    };

    // Private methods ========================================================

    var connect = function() {

        var ws_endpoint = "wss://" + self.get_endpoint();

        // Let us open a web socket
        lws = new WebSocket(ws_endpoint);

        lws.onopen = function() {
            ws = lws;
            console.info("WS connection opened: " + ws_endpoint);
            console.info("There are ["+pending_messages.length+"] pending messages");
            // Send pending messages
            for (var i = 0; i < pending_messages.length; i++) {
                self.send(pending_messages[i]);
            }
            // Clear pending messages
            pending_messages = [];
        };

        lws.onmessage = function(evt) {
            var msgobj = JSON.parse(evt.data);

            var t = msgobj._t;
            if (!t) {
                console.error("No field _t in message!");
                return;
            }

            console.info("Received message from server: " + JSON.stringify(msgobj));

            var the_handler = handlers[t];
            if (!the_handler) {
                console.error("No handler for type ["+ t +"]");
            } else {
                the_handler(msgobj);
            }

        };

        lws.onclose = function() {
            ws = null;
            console.info("WS disconnected");
            // Reconnect after 1 second
            $timeout(function() {
                console.info("Reconnecting WS...");
                connect();
            }, 1000);
        };

    };

    // Public methods =========================================================

    self.send = function(msgobj) {

        if (ws == null) {
            console.info("ws connection not open yet. Adding to pending messages");
            pending_messages.push(msgobj);
        } else {
            ws.send(JSON.stringify(msgobj));
        }

    };

    self.unsent_bytes_more_than = function(limit) {
        if (!ws) {
            return true;
        } else {
            return ws.bufferedAmount > limit;
        }
    };

    // Init ===================================================================

    connect();

});
