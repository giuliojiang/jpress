"use strict";

process.on('uncaughtException', (err) => {
    console.error("Uncaught exception");
    console.error(err);
    process.exit(1);
});

module.exports.execute = async function(testModule) {

    try {
        await testModule.run();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }

};