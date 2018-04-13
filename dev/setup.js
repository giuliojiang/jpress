var path = require("path");
var fs = require("fs");
var passwordhash = require("password-hash");
var readline = require('readline');

// Script ---------------------------------------------------------------------

// Backend configuration defaults
var default_conf = {
    "privkey": "./../local/private.key",
    "cert": "./../local/cert.pem",
    "user": "user",
    "passhash": "somehash",
    "db": "./../local/",
    "upload_path": "./../local/uploads/",
    "port": 21555
};

// Frontend configuration defaults
var default_globals = {
    port: 21555,
    title: "My Blog"
};

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

var finalize = function() {
    fs.writeFileSync(path.join(__dirname, "..", "local", "config.json"), JSON.stringify(default_conf));
    
    var conf_json = JSON.stringify(default_globals);
    var globals_js_text = "var jpress_globals = " + conf_json + ";\n";
    fs.writeFileSync(path.join(__dirname, "..", "client", "globals.js"), globals_js_text);

    process.exit();
}

// Sequence start =============================================================

console.info("Username:");

var actions = [
    (line) => {
        default_conf.user = line;

        console.info("Password:");
    },

    (line) => {
        var passhash = passwordhash.generate(line);
        console.info("Password hash: ["+ passhash +"]");
        default_conf.passhash = passhash;
        
        console.info("Port:");
    },

    (line) => {
        var portint = parseInt(line);
        default_conf.port = portint;
        default_globals.port = portint;

        console.info("Blog name:");
    },

    (line) => {
        default_globals.title = line;

        finalize();
    }
];

rl.on('line', function(line){
    var action = actions[0];
    action(line);
    actions.splice(0, 1);
});
