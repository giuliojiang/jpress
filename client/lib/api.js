"use strict";

jpress.api = {};

// ============================================================================
// The endpoint for JSON-based POST methods
// to communicate with the server
// BASEURL is injected dynamically by the server into
// each HTML page, and contains the base URL component of the
// main application.
jpress.api.endpoint = jpress.main.BASEURL + "/api";

// ============================================================================
// Main communication method to the server
// - msgobj: a javascript object message to be serialized and sent
// - callback: function(msgobj). Called when the server replies. The
//   response is already parsed into an object
jpress.api.communicate = function(msgobj, callback) {
    var xhr = new XMLHttpRequest();
    var url = jpress.api.endpoint;
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () { 
        if (xhr.readyState == 4 && xhr.status == 200) {
            var json = JSON.parse(xhr.responseText);
            callback(json);
        }
    }
    var data = JSON.stringify(msgobj);
    xhr.send(data);
};

// ============================================================================
console.info("jpress api loaded");