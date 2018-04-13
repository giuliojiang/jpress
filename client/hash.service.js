// For documentation see doc/Doc.md

mainApp.service("hash", function(jswindow, switcher) {

    var self = this;

    // Map from string -> handler function
    // The string is the route name
    // The handler function has type function(hash_component)
    var hash_handlers = {};

    var d = {};
    d.last_hash = null;
    d.default_hash_obj = ["posts", 0];

    // ========================================================================
    // Private methods

    // Encode hash from object
    var encode_hash_component = function(arr_obj) {
        var json_str = JSON.stringify(arr_obj);
        var url_encoding = encodeURIComponent(json_str);
        return url_encoding;
    };

    // Decode hash from object
    var decode_hash_component = function(encoded_component) {
        var decoded_hash = decodeURIComponent(encoded_component);
        // Remove initial hash if present
        if (decoded_hash.startsWith("#")) {
            decoded_hash = decoded_hash.substring(1, decoded_hash.length);
        }
        // Get JSON object
        try {
            return JSON.parse(decoded_hash);
        } catch (err) {
            return d.default_hash_obj;
        }
    };

    // Get current hash component
    var get_current_hash_object = function() {
        return decode_hash_component(jswindow.get_window().location.hash);
    };

    // Handle hash change
    var handle_hash_change = function() {
        var current_hash = jswindow.get_window().location.hash;
        console.info("Hash changed to " + current_hash);
        if (current_hash == d.last_hash) {
            console.info("Skipping...");
            return;
        }
        d.last_hash = current_hash;

        var hash_obj = get_current_hash_object();
        if (hash_obj == null) {
            return;
        }
        var target_route = hash_obj[0];
        switcher.show(target_route);
        async.setImmediate(function() {
            var handler = hash_handlers[target_route];
            if (!handler) {
                console.error("No handler registered for target route " + target_route);
                return;
            }
            handler(hash_obj);
        });
    };

    // Register listener for hash changes
    var register_hash_change = function() {
        jswindow.get_window().onhashchange = function() {
            handle_hash_change();
        };
    };

    // Check for current hash during first loading
    var init_check_hash = function() {
        console.info("hash.service.js: init_check_hash");
        async.setImmediate(function() {
            handle_hash_change();
        });
    };

    // ========================================================================

    // <handler> function(hash_component)
    self.register = function(route_name, handler) {
        console.info("HASH HANDLER REGISTERED " + route_name);
        hash_handlers[route_name] = handler;
    };

    // ========================================================================

    self.set_hash = function(hash_obj) {
        var encoded_hash = encode_hash_component(hash_obj);
        async.setImmediate(function() {
            jswindow.get_window().location.hash = encoded_hash;
        });
    };

    // ========================================================================
    // Init

    register_hash_change();
    init_check_hash();

});
