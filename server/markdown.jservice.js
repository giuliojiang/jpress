
var self = {};

// Private --------------------------------------------------------------------

// Returns a filtered string
// Replaces tag symbols with safe characters
var filter_unsafe = function(md_str) {

    var res = md_str.split("<").join("&lt;");
    res = res.split(">").join("&gt;");
    return res;

};

// render_markdown ------------------------------------------------------------

module.exports.render_markdown = function(md_str) {

    var safe_md = filter_unsafe(md_str);
    return self.md.render(safe_md);

};

// init -----------------------------------------------------------------------

module.exports.init = function(jservice) {

    self.md = require('markdown-it')({
        breaks: true,
        linkify: true,
        typographer: true
    });


};
