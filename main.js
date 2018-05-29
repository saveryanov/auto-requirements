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
        var commands = [];
    
        if (params.isInstall) {
            console.log("\nRequirements will be installed: ".bold);
        } else {
            console.log("\nRequirements found: ".bold);
        }
        
        if (Object.keys(results.install).length) {
            let installSummary = controllers.summary.install(results.install, params);
            commands.push(... installSummary.commands);
            console.log(columnify(installSummary.summary));
        } else {
            console.log("Nothing to install".green);
        }
    
        if (params.isUninstall) {
            console.log("\nUnused requirements will be uninstalled: ".bold);
        } else { 
            console.log("\nUnused requirements: ".bold);
        }

        if (Object.keys(results.uninstall).length) {            
            let uninstallSummary = controllers.summary.uninstall(results.uninstall, params);
            commands.push(... uninstallSummary.commands);
            console.log(columnify(uninstallSummary.summary));
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
