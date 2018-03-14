var self = {};

// init -----------------------------------------------------------------------

module.exports.init = function(jservice) {

    self.db_service = jservice.get("db");

    self.file = self.db_service.create_datastore("file");

};

// new_file -------------------------------------------------------------------

// Callback: function(error, id)
module.exports.new_file = function(filename, store_path, callback) {

    var doc = {
        created: new Date(),
        filename: filename,
        store_path: store_path
    };

    self.file.insert(doc, (err, new_doc) => {
        if (err) {
            callback(err);
        } else {
            callback(null, new_doc._id);
        }
    });

};
