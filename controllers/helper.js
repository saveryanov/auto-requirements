#!/usr/bin/env node
var path = require("path"),
    optimist = require("optimist"),
    { exec } = require("child_process"),
    builtinLibs = require('repl')._builtinLibs;
    
require("colors")

module.exports.exec = function (command) {
    return new Promise((resolve, reject) => {
        exec(command, (err, stdout/*, stderr */) => {
            if (err) {
                reject(err);
                return;
            }
            console.log(stdout.grey);
            resolve(stdout);
        });
    });
}

module.exports.isBuiltinLib = function(moduleName) {
    return builtinLibs.indexOf(moduleName) !== -1;
}

module.exports.generateParams = function(argv = optimist.argv) {
    var params = {};

    // path
    params.findPath = path.join(process.env.PWD, argv['path'] || '.');
    params.packagePath = path.join(params.findPath, 'package.json');

    // save
    if (argv['save'] !== undefined) {
        params.save = argv['save'] ? true : false;
    }
    if (argv['no_save'] !== undefined) {
        params.save = argv['no_save'] ? false : true;
    }

    // install
    params.isInstall = false;
    if (argv['no_install'] !== undefined) {
        params.isInstall = argv['no_install'] ? false : true;
    } 
    if (argv['ni'] !== undefined) {
        params.isInstall = argv['ni'] ? false : true;
    }
    if (argv['install'] !== undefined) {
        params.isInstall = argv['install'] ? true : false;
    }
    if (argv['i'] !== undefined) {
        params.isInstall = argv['i'] ? true : false;
    }

    // uninstall
    params.isUninstall = false;
    if (argv['no_uninstall'] !== undefined) {
        params.isUninstall = argv['no_uninstall'] ? false : true;
    } 
    if (argv['nu'] !== undefined) {
        params.isUninstall = argv['nu'] ? false : true;
    }
    if (argv['uninstall'] !== undefined) {
        params.isUninstall = argv['uninstall'] ? true : false;
    }
    if (argv['u'] !== undefined) {
        params.isUninstall = argv['u'] ? true : false;
    }
    
    return params;
}