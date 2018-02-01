mainApp.service('rawhtml', function() {

    // setHTML ----------------------------------------------------------------

    this.setHTML = function(elem_id, raw_html) {
        document.getElementById(elem_id).innerHTML = raw_html;
    };

});
