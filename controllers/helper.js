#!/usr/bin/env node
var path = require("path"),
    optimist = require("optimist"),
    { exec } = require("child_process");

module.exports.exec = function (command) {
    return new Promise((resolve, reject) => {
        exec(command, (err, stdout/*, stderr */) => {
            if (err) {
                reject(err);
                return;
            }
            console.log(stdout);
            resolve(stdout);
        });
    });
}

module.exports.generateParams = function(argv = optimist.argv) {
    var params = {};

    // path
    params.findPath = path.join(process.env.PWD, argv['path'] || '.');
    params.packagePath = path.join(params.findPath, 'package.json');

    // save exact
    params.saveExact = false;
    if (argv['save_exact'] !== undefined) {
        params.saveExact = argv['save_exact'] ? true : false;
    }
    if (argv['save-exact'] !== undefined) {
        params.saveExact = argv['save-exact'] ? true : false;
    }
    if (argv['E'] !== undefined) {
        params.saveExact = argv['E'] ? true : false;
    }

    // save
    params.save = true;
    if (argv['save'] !== undefined) {
        params.save = argv['save'] ? true : false;
    }
    if (argv['no_save'] !== undefined) {
        params.save = argv['no_save'] ? false : true;
    }

    // install exact
    params.installExact = false;
    if (argv['install_exact'] !== undefined) {
        params.installExact = argv['install_exact'] ? true : false;
    }
    if (argv['install-exact'] !== undefined) {
        params.installExact = argv['install-exact'] ? true : false;
    }
    if (argv['ie'] !== undefined) {
        params.installExact = argv['ie'] ? true : false;
    }

    // install
    params.isInstall = true;
    if (argv['no_install'] !== undefined) {
        params.isInstall = argv['no_install'] ? false : true;
    } 
    if (argv['ni'] !== undefined) {
        params.isInstall = argv['ni'] ? false : true;
    }
    if (argv['install'] !== undefined) {
        params.isInstall = argv['install'] ? true : false;
    }

    // uninstall
    params.isUninstall = true;
    if (argv['no_uninstall'] !== undefined) {
        params.isUninstall = argv['no_uninstall'] ? false : true;
    } 
    if (argv['nu'] !== undefined) {
        params.isUninstall = argv['nu'] ? false : true;
    }
    if (argv['uninstall'] !== undefined) {
        params.isUninstall = argv['uninstall'] ? true : false;
    }
    
    return params;
}