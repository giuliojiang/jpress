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
