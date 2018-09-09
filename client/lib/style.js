"use strict";

jpress.style = {};

jpress.style.enableLayers = function() {

    var elems = document.getElementsByClassName("jgrid-layer-top1");
    for (var i = 0; i < elems.length; i++) {
        var elem = elems[i];
        elem.style.display = "unset";
    }

}
