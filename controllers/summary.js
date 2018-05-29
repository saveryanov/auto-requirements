#!/usr/bin/env node
var controllers = require("../controllers");
require("colors");

module.exports.install = function(toInstall, params) {
    var commands = [];
    let summary = [];

    if (Object.keys(toInstall).length) {
        for (let req of Object.keys(toInstall)) {
            let packageVersion = toInstall[req].packageVersion ? toInstall[req].packageVersion : toInstall[req].packageDevVersion;
            let isInPackage = packageVersion ? true : false;
            let isInPackageDev = toInstall[req].packageDevVersion && !toInstall[req].packageVersion ? true : false;

            let command = `npm install ${req}`;
            
            if (packageVersion) {
                command += `@${packageVersion}`;
            }
            if (params.save !== undefined) {
                if (params.save) {
                    command += isInPackageDev ? " --save-dev" : " --save";
                } else {
                    command += " --no-save";
                }
            } else {
                if (isInPackage) {
                    command += " --no-save";
                } else {
                    command += isInPackageDev ? " --save-dev" : " --save";
                }
            }

            if (params.isInstall) {
                if (!controllers.helper.isBuiltinLib(req)) {
                    commands.push(command);
                }
            }
            let packageVersionString = `${packageVersion}${isInPackageDev ? ' (dev)' : ''}`;
            summary.push({
                module: req.green.bold,
                used: toInstall[req].occurrences.toString().black,
                version: (isInPackage ? packageVersionString.green : controllers.helper.isBuiltinLib(req) ? " no ".green : " no ".red),
                command: controllers.helper.isBuiltinLib(req) ? command.grey.dim : command.grey,
                comment: controllers.helper.isBuiltinLib(req) ? 'built-in module'.yellow : ''
            });
        }
    }

    return {
        summary: summary,
        commands: commands
    }
}


module.exports.uninstall = function(toUninstall, params) {
    var commands = [];
    let summary = [];


    if (Object.keys(toUninstall).length) {
        for (let req of Object.keys(toUninstall)) {              
            let command = `npm uninstall ${req}`;
            if (params.save !== undefined) {
                command += params.save ? " --save" : " --no-save";
            } else {
                command += " --save";
            }

            if (params.isUninstall) {
                commands.push(command);
            }

            summary.push({
                'module': req.red.bold,
                'command': command.grey,
                'comment': controllers.helper.isBuiltinLib(req) ? 'built-in module'.yellow : ''
            });
        }
    }

    return {
        summary: summary,
        commands: commands
    }
}