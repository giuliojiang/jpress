var self = {};
var page_size = 25;

// init -----------------------------------------------------------------------

module.exports.init = function(jservice) {

    self.db_service = jservice.get("db");

    self.post = self.db_service.create_datastore("post");

};

// new_post -------------------------------------------------------------------

// Callback format: callback(error, _id)
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
            callback(null, new_doc._id);
        }
    });

};

// get_posts ------------------------------------------------------------------
// [private]

// Callback format: callback(error, results)
// results: array of post objects
module.exports.get_posts = function(skip, limit, callback) {

    self.post.find({
    }).sort({
        created: -1
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
            var page_count = Math.ceil(count / page_size);
            callback(null, page_count);
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

// get_post_by_id -------------------------------------------------------------

// Callback format: callback(error, doc)
module.exports.get_post_by_id = function(post_id, callback) {

    self.post.find({
        _id: post_id
    }, (err, docs) => {
        if (err) {
            callback(err);
        } else {
            if (docs.length != 1) {
                callback("Found ["+docs.length+"] posts with id ["+post_id+"]");
            } else {
                callback(null, docs[0]);
            }
        }
    });

};
