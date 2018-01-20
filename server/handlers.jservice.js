

// init -----------------------------------------------------------------------

var init = function(jservice) {

};

// handle ---------------------------------------------------------------------

var handle = function(msgobj, socket) {
    console.info("handlers.jservice: Got message: " + JSON.stringify(msgobj));
};

// Exports --------------------------------------------------------------------

module.exports = {
    init: init,
    handle: handle
};
