var timeout;
var token_generator;

// Local data -----------------------------------------------------------------

var active_token = null;
var clear_handle = null;

// Private methods ------------------------------------------------------------

var clear_timeout = function() {
    if (clear_handle) {
        timeout.clear(clear_handle);
        clear_handle = null;
    }
};

// init -----------------------------------------------------------------------

var init = function(jservice) {
    timeout = jservice.get("timeout");
    token_generator = jservice.get("token_generator");
};

// start_session --------------------------------------------------------------

// Returns a new token
var start_session = function() {
    var tok = token_generator.new_token();

    active_token = tok;

    clear_timeout();

    clear_handle = timeout.set(() => {
        clear_handle = null;
        active_token = null;
    }, 1000 * 3600 * 24); // Clear after 24 hours
};

// token_valid ----------------------------------------------------------------

var token_valid = function(token) {
    if (!active_token) {
        return false;
    }

    return token == active_token;
};

// end_session ----------------------------------------------------------------

var end_session = function() {
    active_token = null;

    clear_timeout();
};

// Exports --------------------------------------------------------------------

module.exports = {
    init: init,
    start_session: start_session,
    token_valid: token_valid,
    end_session: end_session
};
