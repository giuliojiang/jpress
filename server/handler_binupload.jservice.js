var async = require("async");

    // TODO add timeouts in case client disconnects mid-way through
    // file uploads

var self = {};
var priv = {};

// Data =======================================================================

// Map from transfer_id to transfer_obj
// A transfer obj is: {name, wstream, path}
var active_uploads = {};

// Handlers ===================================================================

var handle_bin_up = function(msgobj, socket) {

    console.info("handler_binupload: handle_bin_up");

    var token = msgobj.token;
    var name = msgobj.name;

    if (!self.client_session.token_valid(token)) {
        console.info("Token not valid");
        return;
    }

    if (!self.util.is_string(name)) {
        self.ws.alert(socket, "Invalid file");
        return;
    }

    var new_transfer_id = priv.generate_transfer_id();
    priv.initialize_new_file((err, wstream, file_path) => {
        if (err) {
            priv.abort_transfer(new_transfer_id, socket);
            console.error("Error in handler_binupload.jservice.js: handle_bin_up");
            console.error(err);
            return;
        } else {
            var new_transfer_obj = {
                name: name,
                wstream: wstream,
                path: file_path
            };
            console.info("File upload: writing to " + file_path);

            // Add to active uploads
            active_uploads[new_transfer_id] = new_transfer_obj;

            // Send client info message
            self.ws.send(socket, {
                _t: "_bin_up",
                transfer_id: new_transfer_id,
                name: name
            });
        }
    });

};

var handle_bin_end = function(msgobj, socket) {

    console.info("handler_binupload: handle_bin_end");

    var transfer_id = msgobj.transfer_id;
    var token = msgobj.token;

    if (!self.client_session.token_valid(token)) {
        return;
    }

    if (!self.util.is_string(transfer_id)) {
        return;
    }

    var upload_obj = active_uploads[transfer_id];
    var wstream = upload_obj.wstream;
    var db_file_id;

    async.waterfall([

        // Close the writable stream
        (callback) => {
            self.util.wstream_close(wstream, callback);
        },

        // add entry to database
        (callback) => {
            self.db_file.new_file(upload_obj.name, upload_obj.path, (err, file_id) => {
                if (err) {
                    callback(err);
                } else {
                    db_file_id = file_id;
                    callback();
                }
            });
        },

        // notify client of completion
        (callback) => {
            self.ws.send(socket, {
                _t: "_bin_up_complete",
                transfer_id: transfer_id,
                file_id: db_file_id
            });
            callback();
        }

    ], (err) => {
        if (err) {
            console.error("Error in handle_binupload: handle_bin_end");
            console.error(err);
        }
    });

};

var handle_bin = function(msgobj, socket) {

    var transfer_id = msgobj.transfer_id;
    var data = msgobj.data;
    var token = msgobj.token;

    // Check token
    if (!self.client_session.token_valid(token)) {
        return;
    }

    // Check data
    if (!self.util.is_string(data)) {
        return;
    }

    // Check transfer_id
    if (!self.util.is_string(transfer_id)) {
        return;
    }

    // Get the active upload
    var upload_obj = active_uploads[transfer_id];
    if (!upload_obj) {
        return;
    }

    // Get the writable stream
    var wstream = upload_obj.wstream;

    self.util.wstream_append_b64(wstream, data);

};

// Private methods ============================================================

priv.generate_transfer_id = function() {
    while (true) {
        var new_token = self.token_generator.new_token();
        if (!(new_token in active_uploads)) {
            active_uploads[new_token] = {};
            return new_token;
        }
    }
};

// Callback: function(err, wstream, file_path)
priv.initialize_new_file = function(callback) {

    var attempts_remaining = 5;

    // Callback: function(err, wstream, file_path)
    var attempt_create_file = function(callback) {
        attempts_remaining -= 1;
        if (attempts_remaining <= 0) {
            callback("Could not create a new file on disk. All attempts exhausted");
            return;
        }

        // Get a new filename
        var rand_filename = self.token_generator.new_token();
        var file_path = self.config.vals.upload_path + rand_filename;

        // Create file. Fails if file exists
        self.util.open_file_writestream_safe(file_path, function(err, wstream) {
            if (err) {
                // Fail, call attempt_create_file again
                async.setImmediate(() => {
                    attempt_create_file(callback);
                });
            } else {
                // Success, callback with fd
                callback(null, wstream, file_path);
            }
        });
    };

    attempt_create_file(callback);

};

priv.abort_transfer = function(transfer_id, socket) {
    // send client the transfer aborted message
    self.ws.send(socket, {
        _t: "_bin_up_complete",
        transfer_id: transfer_id,
        file_id: null
    });

    // delete file on disk of exists
    var upload_obj = active_uploads[transfer_id];
    if (upload_obj) {
        var fd = upload_obj.fd;
        // Try closing the file
        self.util.file_close(fd, (err) => {});
        // Try deleting the file
        self.util.file_delete(upload_obj.path, (err) => {});
    }

    // delete entry from active_uploads
    delete active_uploads[transfer_id];
};

// init -----------------------------------------------------------------------

module.exports.init = function(jservice) {

    self.handlers = jservice.get("handlers");
    self.ws = jservice.get("ws");
    self.client_session = jservice.get("client_session");
    self.util = jservice.get("util");
    self.token_generator = jservice.get("token_generator");
    self.config = jservice.get("config");
    self.db_file = jservice.get("db_file");

    self.handlers.register("_bin_up", handle_bin_up);
    self.handlers.register("_bin_end", handle_bin_end);
    self.handlers.register("_bin", handle_bin);

    // create upload directory if not exists
    self.util.mkdir_sync(self.config.vals.upload_path);

};
