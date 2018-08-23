"use strict";

module.exports.execute = async function(testModule) {

    try {
        await testModule.run();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }

};