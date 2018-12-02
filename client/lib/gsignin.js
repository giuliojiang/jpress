"use strict";

// based on https://developers.google.com/identity/sign-in/web/backend-auth

jpress.gsignin = {};
jpress.gsignin.token = null; // Will hold the token when user is signed in
jpress.gsignin.signOut = null; // Function to sign out

// Load google API library
{
    var scriptElem = document.createElement("script");
    scriptElem.src = "https://apis.google.com/js/platform.js";
    document.head.appendChild(scriptElem);
}

// Add the meta tag
{
    var metaElem = document.createElement("meta");
    metaElem.name = "google-signin-client_id";
    metaElem.content = jpress.main.GSIGNIN_CLIENTID;
    document.head.appendChild(metaElem);
}

// ============================================================================
var jpress_on_google_sign_in = function(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    console.info("Login success");
    jpress.gsignin.token = id_token;
};

// ============================================================================
jpress.gsignin.signOut = function() {
    // Send sign out message to server
    jpress.api.communicate({
        _t: "general_logout",
        _tok: jpress.gsignin.token
    }, function(msgobj) {
        // Do nothing
    });

    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        jpress.gsignin.token = null;
        console.log('Signed out');
    });
};

// ============================================================================
jpress.gsignin.callWhenLoginSuccessful = function(func) {
    var handle = setInterval(function() {
        if (jpress.gsignin.token) {
            clearInterval(handle);
            func();
        }
    }, 250);
};
