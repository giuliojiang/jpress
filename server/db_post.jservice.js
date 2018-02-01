var self = {};
var page_size = 50;

// init -----------------------------------------------------------------------

module.exports.init = function(jservice) {

    self.db_service = jservice.get("db");

    self.post = self.db_service.create_datastore("post");

};

// new_post -------------------------------------------------------------------

// Callback format: callback(error)
module.exports.new_post = function(title, body, callback) {

    var doc = {
        created: new Date(),
        title: title,
        body: body
    };

    self.post.insert(doc, (err, new_doc) => {
        if (err) {
            callback(err);
        } else {
            callback();
        }
    });

};

// get_posts ------------------------------------------------------------------

// Callback format: callback(error, results)
// results: array of post objects
module.exports.get_posts = function(skip, limit, callback) {

    self.post.find({
    }).sort({
        created: 1
    }).skip(skip)
    .limit(limit)
    .exec((err, docs) => {
        if (err) {
            callback(err);
        } else {
            callback(null, docs);
        }
    });

};

// count_pages ----------------------------------------------------------------

// Callback format: callback(error, no_pages)
module.exports.count_pages = function(callback) {

    self.post.count({
    }, (err, count) => {
        if (err) {
            callback(err);
        } else {
            callback(null, count);
        }
    });

};

// get_posts_page -------------------------------------------------------------

// Callback format: callback(error, results)
// results: array of post objects
module.exports.get_posts_page = function(page_number, callback) {

    var skip = page_number * page_size;
    var limit = page_size;

    module.exports.get_posts(skip, limit, (err, results) => {
        if (err) {
            callback(err);
        } else {
            callback(null, results);
        }
    });

};
