#!/usr/bin/env node
var path = require("path"),
    detective = require("detective"),
    fs = require("fs");

function getPackageDependencies(params) {
    var packageDependencies = {};
    if (fs.existsSync(params.packagePath)) {
        var packageParsed = require(params.packagePath);
        if (packageParsed.dependencies) {
            packageDependencies = packageParsed.dependencies;
        }
    }
    return packageDependencies;
}

module.exports.parse = function(params) {

    return new Promise((resolve, reject) => {

        var installPackages = {};

        var packageDependencies = getPackageDependencies(params);
        var uninstallPackages = Object.assign({}, packageDependencies);
        
        var findit = require('findit')(params.findPath);

        findit.on('directory', function (dir, stat, stop) {
            var base = path.basename(dir);
            if (base === '.git' || base === 'node_modules') stop();
        });
        
        findit.on('file', function (file/*, stat */) {
            try {
                if (path.parse(file).ext != '.js') return;
                var src = fs.readFileSync(file);
                var fileinstallPackages = detective(src).filter(req => req.match(/^\./i) == null);
                for (let req of fileinstallPackages) {
                    req = req.split('/')[0];
                    if (installPackages[req] == undefined) {   // add new requirement in list
                        installPackages[req] = { 
                            name: req, 
                            packageVersion: packageDependencies[req] ? packageDependencies[req] : null,
                            occurrences: 1
                        };
                    } else {    // increment counter
                        installPackages[req].occurrences++;
                    }
                    delete uninstallPackages[req];    // delete from 
                }
            } catch (e) {
                console.error(`Error occured with file: ${file}`.red)
                console.error(e);
            }
        });
        

        findit.on('error', function (error) {
            reject(error);
        });

        findit.on('end', function () {
            resolve({
                install: installPackages,
                uninstall: uninstallPackages
            });
        })
    });
}
