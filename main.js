#!/usr/bin/env node
var controllers = require("./controllers"),
    colors = require("colors"),
    columnify = require('columnify');

colors.setTheme({
    link: ['cyan', 'underline'],
});

var params = controllers.helper.generateParams();

console.log("Check requirements in: ".bold + params.findPath.link);

controllers.parser
    .parse(params)
    .then(results => {
        var toInstall = Object.keys(results.install);
        var toUninstall = Object.keys(results.uninstall);
        var commands = [];
    
        if (params.isInstall) {
            console.log("\nRequirements will be installed: ".bold);
        } else {
            console.log("\nRequirements found: ".bold);
        }
        
        if (toInstall.length) {
            let tableData = [];
            toInstall.forEach(req => {

                
                let packageVersion = results.install[req].packageVersion ? results.install[req].packageVersion : results.install[req].packageDevVersion;
                let isInPackage = packageVersion ? true : false;
                let isInPackageDev = results.install[req].packageDevVersion && !results.install[req].packageVersion ? true : false;
                let inPackageExact = packageVersion && packageVersion[0] !== '^';

                let command = `npm install ${req}`;
                
                if (inPackageExact) {
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
                tableData.push({
                    'module': req.green.bold,
                    'used': results.install[req].occurrences.toString().black,
                    'version': (isInPackage ? packageVersionString.green : controllers.helper.isBuiltinLib(req) ? " no ".green : " no ".red),
                    'command': controllers.helper.isBuiltinLib(req) ? command.grey.dim : command.grey,
                    'comment': controllers.helper.isBuiltinLib(req) ? 'built-in module'.yellow : ''
                });
            });
            console.log(columnify(tableData));
        } else {
            console.log("Nothing to install".green);
        }
    
    
        if (params.isUninstall) {
            console.log("\nUnused requirements will be uninstalled: ".bold);
        } else { 
            console.log("\nUnused requirements: ".bold);
        }
        if (toUninstall.length) {
            let tableData = [];
            toUninstall.forEach(req => {                
                let command = `npm uninstall ${req}`;
                if (params.save !== undefined) {
                    command += params.save ? " --save" : " --no-save";
                } else {
                    command += " --save";
                }
    
                if (params.isUninstall) {
                    commands.push(command);
                }
    
                tableData.push({
                    'module': req.red.bold,
                    'command': command.grey,
                    'comment': controllers.helper.isBuiltinLib(req) ? 'built-in module'.yellow : ''
                });
            });
            console.log(columnify(tableData));
        } else {
            console.log("No unused dependencies".green);
        }
        
        if (commands.length) {
            console.log('\nProcessing commands. Please wait...');
            return controllers.executioner.exec(commands);
        } 
        return new Promise(r => r());
    })
    .then(() => {
        console.log("\nAll done.".green);
    })
    .catch(e => {
        console.error(e);
        console.log("Ended with errors.".red);
    });
