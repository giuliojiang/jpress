// This service listens and manages changes to the
// URL's hash component. Allows the user to follow direct links
// to different parts of the site

// Encoding of URI components:
// JSON string of [target, data...]
// The target encodes the path that needs to be activated, for example "posts"
// data is arbitrary data that will be passed to the controller.
// The controller will receive the full array, including the target part.

// Targets that can handle hashchange events will register on this service
// using the register() method.
// The registered handler has the shape:
//     function(hash_component)
// where the hash_component is the type of js array defined above.

mainApp.service("hash", function(jswindow, switcher) {

    var self = this;

    // Map from string -> handler function
    // The string is the route name
    // The handler function has type function(hash_component)
    var hash_handlers = {};

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
        return JSON.parse(decoded_hash);
    };

    // Get current hash component
    var get_current_hash_object = function() {
        return decode_hash_component(jswindow.get_window().location.hash);
    };

    // Handle hash change
    var handle_hash_change = function() {
        console.info("Detected hash change");
        var hash_obj = get_current_hash_object();
        var target_route = hash_obj[0];
        switcher.show(target_route);
        async.setImmediate(function() {
            var handler = hash_handlers[target_route];
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
        async.setImmediate(function() {
            handle_hash_change();
        });
    };

    // ========================================================================

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
