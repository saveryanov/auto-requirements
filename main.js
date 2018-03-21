#!/usr/bin/env node
var optimist = require("optimist");
var path = require("path");
var detective = require("detective");
var fs = require("fs");
var colors = require("colors");
var { exec } = require("child_process");


colors.setTheme({
    link: ['cyan', 'underline'],
});

var argv = optimist.argv;
var findPath = path.join(process.env.PWD, argv.path || '.');
var isInstall = argv.no_install === undefined;
var isUninstall = argv.no_uninstall === undefined;

console.log("Find requirements in: " + findPath.link);
var findit = require('findit')(findPath);

var packagePath = path.join(findPath, 'package.json');
var packageDependencies = [];
if (fs.existsSync(packagePath)) {
    var packageParsed = require(packagePath);
    if (packageParsed.dependencies) {
        packageDependencies = packageParsed.dependencies;
    }
}

var requires = {};

findit.on('directory', function (dir, stat, stop) {
    var base = path.basename(dir);
    if (base === '.git' || base === 'node_modules') stop();
});

findit.on('file', function (file/*, stat */) {
    try {
        if (path.parse(file).ext != '.js') return;
        var src = fs.readFileSync(file);
        var fileRequires = detective(src).filter(req => req.match(/^\./i) == null);
        for (let req of fileRequires) {
            requires[req] = true;
            delete packageDependencies[req];
        }
    } catch (e) {
        console.error(`Error occured with file: ${file}`.red)
        console.error(e);
    }
});

findit.on('end', function () {
    var toInstall = Object.keys(requires);
    var toUninstall = Object.keys(packageDependencies);
    
    if (isInstall)
        console.log("Requirements will be installed: ");
    else 
        console.log("Requirements found: ");
    
    if (toInstall.length) {
        toInstall.forEach(req => {
            console.log("* " + req.green + " (" + `npm install ${req} --save`.grey + ")");
        });
    } else {
        console.log("Nothing to install".green);
    }


    if (isUninstall)
        console.log("Unused requirements will be uninstalled: ");
    else 
        console.log("Unused requirements: ");

    if (toUninstall.length) {
        toUninstall.forEach(req => {
            console.log("* " + req.red + " (" + `npm uninstall ${req} --save`.grey + ")");
        });
    } else {
        console.log("No unused dependencies".green);
    }


    if (isInstall) {
        toInstall.forEach(req => {
            exec(`npm install ${req} --save`, (err, stdout/*, stderr */) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(stdout);
            });
        });
    }


    if (isUninstall) {
        toUninstall.forEach(req => {
            exec(`npm uninstall ${req} --save`, (err, stdout/*, stderr */) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(stdout);
            });
        });
    }
})