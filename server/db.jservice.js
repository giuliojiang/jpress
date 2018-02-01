var self = {};

// init -----------------------------------------------------------------------

module.exports.init = function(jservice) {

    self.Datastore = require('nedb');
    // , db = new Datastore({ filename: 'path/to/datafile', autoload: true });

    self.path = require("path");
    self.config_service = jservice.get("config");

    self.db_path = self.config_service.vals.db;
};

// create_datastore -----------------------------------------------------------

// Returns the created datastore
module.exports.create_datastore = function(name) {
    return new self.Datastore({
        filename: self.path.join(self.db_path, name),
        autoload: true
    });
};
