// Data -----------------------------------------------------------------------

var services = {};
var active_services = {};

// Register -------------------------------------------------------------------

var register = function(name, srvc) {
    if (name in services || name in active_services) {
        console.warn("JSERVICE: A service with name ["+ name +"] already exists");
    }
    services[name] = srvc;
};

// Get ------------------------------------------------------------------------

var get = function(name) {
    if (name in active_services) {
        return active_services[name];
    }

    if (name in services) {
        var the_service = services[name];
        console.info("JSERVICE: initializing jservice ["+ name +"]");
        the_service.init(module.exports);
        delete services[name];
        active_services[name] = the_service;
        return the_service;
    }

    throw "JSERVICE: No service named ["+ name +"] found";
};

// Export ---------------------------------------------------------------------

module.exports = {
    register: register,
    get: get
};
