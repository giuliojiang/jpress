
// init -----------------------------------------------------------------------

module.exports.init = function(jservice) {
    var fs = require("fs");
    var path = require("path");

    var read_file = fs.readFileSync(path.join(__dirname, "..", "local", "config.json"));
    module.exports.vals = JSON.parse(read_file);
};
