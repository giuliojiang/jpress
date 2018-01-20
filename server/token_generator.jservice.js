var randomstring;

// init -----------------------------------------------------------------------

var init = function(jservice) {
    randomstring = require("randomstring");
};

// new_token ------------------------------------------------------------------

var new_token = function() {
    return randomstring.generate(30);
};

// Exports --------------------------------------------------------------------

module.exports = {
    init: init,
    new_token: new_token
};
