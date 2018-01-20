

// init -----------------------------------------------------------------------

var init = function(jservice) {

};

// set ------------------------------------------------------------------------

var set = function(func, duration) {
    return setTimeout(func, duration);
};

// clear ----------------------------------------------------------------------

var clear = function(handle) {
    clearTimeout(handle);
};

// Exports --------------------------------------------------------------------

module.exports = {
    init: init,
    set: set,
    clear: clear
};
