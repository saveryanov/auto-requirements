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
                let command = `npm install ${req}` +
                    (params.installExact && results.install[req].packageVersion && results.install[req].packageVersion[0] !== '^' ? `@${results.install[req].packageVersion}`: "") +
                    `${params.save ? " --save" : ""}` + 
                    `${params.saveExact ? " --save-exact" : "--no-save"}`;
    
                if (params.isInstall) {
                    commands.push(command);
                }
    
                tableData.push({
                    'module': req.green.bold,
                    'used': results.install[req].occurrences.toString().black,
                    'version': (results.install[req].packageVersion ? results.install[req].packageVersion.green : " no ".red),
                    'command': command.grey
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
                let command = `npm uninstall ${req}` +
                    `${params.save ? " --save" : "--no-save"}`;
    
                if (params.isUninstall) {
                    commands.push(command);
                }
    
                tableData.push({
                    'module': req.red.bold,
                    'command': command.grey
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
