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

// get_file -------------------------------------------------------------------

// Callback: function(error, file_name, file_path)
module.exports.get_file = function(file_id, callback) {

    self.file.find({
        _id: file_id
    }, (err, docs) => {
        if (err) {
            callback(err);
        } else if (docs.length != 1) {
            callback(new Error("Found ["+docs.length+"] documents"));
        } else {
            var the_doc = docs[0];
            callback(null, the_doc.filename, the_doc.store_path);
        }
    });

};

// ----------------------------------------------------------------------------
// Set owner

// <callback> function(err)
module.exports.set_owner = function(file_id, post_id, callback) {
    console.info("Setting ownership between ["+ file_id +"] ["+ post_id +"]");
    self.file.update(

        {
            _id: file_id
        },

        {
            $set: {
                owner: post_id
            }
        },

        {
            multi: false
        },

        function(err, num_replaced) {
            if (err) {
                callback(err);
            } else {
                console.info("Updated ["+ num_replaced +"] entries");
                callback();
            }
        }

    );
}