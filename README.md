# auto-requirements

[![NPM version](https://img.shields.io/npm/v/auto-requirements.svg)](https://www.npmjs.com/package/auto-requirements)

Autoreq is a command line utility that allows to parse js files in current directory to find used packages and install them or uninstall unused ones.

It will ignore js files in node_modules folder.

![auto-requirements self execution example](https://github.com/saveryanov/auto-requirements/blob/master/examples/exec-result.png?raw=true)

## Install

You can install it by npm:

```commandline
npm install -g auto-requirements
```

## Usage

To scan current directory and installing all found packages and uninstall unused dependencies execute this in command line:

```commandline
autoreq --install --uninstall
```

Aliases:

* *autoreq*
* *a_r*
* *auto_requirements*

## Params

### --install

Execute all install commands from summary table. By default without this param it will **not** execute all install commands.

Install variations:

* *autoreq --install*
* *autoreq -i*

### --uninstall

Execute all uninstall commands from summary table. By default without this param it will **not** execute all uninstall commands.

Uninstall variations:

* *autoreq --uninstall*
* *autoreq -u*

### --save, --no-save

Use --save/--no-save flag in npm install commands. By default it will save all packages that isn't in package (and --save-dev for devDependencies).

Variations for no-save:

* *autoreq --save=0*
* *autoreq --no-save*
* *autoreq --no_save*

Variations for save:

* *autoreq --save=1*
* *autoreq --save*
