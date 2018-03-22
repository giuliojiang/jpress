var fs = require("fs");

// init -----------------------------------------------------------------------

module.exports.init = function(jservice) {

};

// is_number ------------------------------------------------------------------

module.exports.is_number = function(data) {

    return (typeof data === 'number') && ((data % 1) === 0);

};

// is_string ==================================================================

module.exports.is_string = function(data) {
    return typeof data === 'string';
};

// mkdir_sync =================================================================

module.exports.mkdir_sync = function(path) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
};

// open file writestream  =====================================================

// Callback: function(err, wstream)
module.exports.open_file_writestream_safe = function(path, callback) {
    var wstream = fs.createWriteStream(path, {
        flags: "wx"
    });
    wstream.on("open", () => {
        callback(null, wstream);
    });
    wstream.on("error", (err) => {
        callback(err);
    });
};

// Callback: function(err, fd)
module.exports.open_file_write_safe = function(path, callback) {
    fs.open(path, 'wx', callback);
};

// file_close =================================================================

// Callback: function(err)
module.exports.file_close = function(fd, callback) {
    fs.close(fd, callback);
};

// file_delete ================================================================

// Callback: function(err)
module.exports.file_delete = function(path, callback) {
    fs.unlink(path, callback);
};

// file_append_b64 ============================================================

// Callback: function(err)
module.exports.file_append_b64 = function(fd, b64_data, callback) {
    fs.write(fd, b64_data, null, "base64", function(err, written, st) {
        if (err) {
            callback(err);
        } else {
            callback();
        }
    });
};

// write stream append b64 ====================================================

module.exports.wstream_append_b64 = function(wstream, b64_data) {
    wstream.write(b64_data, "base64");
};

// writable stream close ======================================================

// Callback: function()
module.exports.wstream_close = function(wstream, callback) {
    wstream.end(null, null, callback);
};
