var passwordhash;

// init -----------------------------------------------------------------------

var init = function(jservice) {
    passwordhash = require("password-hash");
};

// verify ---------------------------------------------------------------------

var verify = function(pass, hash) {
    return passwordhash.verify(pass, hash);
};

// Exports --------------------------------------------------------------------

module.exports = {
    init: init,
    verify: verify
};
