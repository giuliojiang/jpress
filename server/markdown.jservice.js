
var self = {};

// render_markdown ------------------------------------------------------------

module.exports.render_markdown = function(md_str) {

    return self.md.render(md_str);

};

// init -----------------------------------------------------------------------

module.exports.init = function(jservice) {

    self.hljs = require('highlight.js');

    self.md = require('markdown-it')({
        breaks: true,
        linkify: true,
        typographer: true,
        highlight: function (str, lang) {
            if (lang && self.hljs.getLanguage(lang)) {
                try {
                    return self.hljs.highlight(lang, str).value;
                } catch (__) {}
            }
            return ''; // use external default escaping
        }
    });


};
