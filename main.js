var optimist = require('optimist'),
    path = require('path'),
    detective = require('detective'),
    fs = require('fs'),
    colors = require('colors'),
    { exec } = require('child_process');


colors.setTheme({
    link: ['cyan', 'underline'],
});

var argv = optimist.argv;
var findPath = path.join(process.env.PWD, argv.path || '.');
var isInstall = argv.no_install === undefined;

console.log("Find requirements in: " + findPath.link);
var findit = require('findit')(findPath);

var requires = {};

findit.on('directory', function (dir, stat, stop) {
    var base = path.basename(dir);
    if (base === '.git' || base === 'node_modules') stop();
});

findit.on('file', function (file/*, stat */) {
    var src = fs.readFileSync(file);
    var fileRequires = detective(src).filter(req => req.match(/^\./i) == null);
    for (let req of fileRequires) {
        requires[req] = true;
    }
});

findit.on('end', function () {
    requires = Object.keys(requires);
    
    if (isInstall)
        console.log("Requirements will be installed: ");
    else 
        console.log("Requirements found: ");
    requires.forEach(req => {
        console.log("* " + req.green + " (" + `npm install ${req} --save`.grey + ")");
    });

    if (isInstall) {
        requires.forEach(req => {
            exec(`npm install ${req} --save`, (err, stdout/*, stderr */) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(stdout);
            });
        });
    }
})