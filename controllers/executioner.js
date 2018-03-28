#!/usr/bin/env node
var controllers = require("../controllers");

var exec = controllers.helper.exec;

module.exports.exec = function(commands) {
    return new Promise((resolve, reject) => {
        if (commands.length) {
            let commandPromises = [];
            commands.forEach(command => {
                commandPromises.push(exec(command));
            });
            Promise.all(commandPromises)
                .then(resolve)
                .catch(reject);
        } else {
            resolve();
        }
    });   
}
