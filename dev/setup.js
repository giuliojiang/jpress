var path = require("path");
var fs = require("fs");
var passwordhash = require("password-hash");
var readline = require('readline');

// Script ---------------------------------------------------------------------

var default_conf = {
    "privkey": "./../local/private.key",
    "cert": "./../local/cert.pem",
    "port": 21555,
    "user": "user",
    "passhash": "somehash"
};

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

console.info("Server port:");

var actions = [
    (line) => {
        console.info("User: ["+ line +"]");
        default_conf.user = line;

        console.info("Password:");
    },

    (line) => {
        var passhash = passwordhash.generate(line);
        console.info("Password hash: ["+ passhash +"]");
        default_conf.passhash = passhash;
        fs.writeFileSync(path.join(__dirname, "..", "local", "config.json"), JSON.stringify(default_conf));
        process.exit();
    }
];

rl.on('line', function(line){
    var action = actions[0];
    action(line);
    actions.splice(0, 1);
});
