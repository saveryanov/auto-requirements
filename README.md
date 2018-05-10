# auto-requirements

[![NPM version](https://img.shields.io/npm/v/auto-requirements.svg)](https://www.npmjs.com/package/auto-requirements)

Autoreq is a command line utility that allows to parse js files in current directory to find used packages and install them or uninstall unused ones.

It will ignore js files in node_modules folder.

![auto-requirements self execution example](https://raw.githubusercontent.com/saveryanov/auto-requirements/blob/master/examples/exec-result.png?raw=true)

## Install

You can install it by npm:

```commandline
npm install -g auto-requirements
```

## Usage

To scan current directory and installing all found packages and uninstall unused dependencies execute this in command line:

```commandline
autoreq
```

Aliases:

* autoreq
* a_r
* auto_requirements

## Params

### --no-install

Install packages and only need to display list. Variations:

* autoreq --no_install
* autoreq --no-install
* autoreq --install=0
* autoreq --ni

Default: execute all install commands.

### --no-uninstall

Uninstall unused packages and only need to display list. Variations:

* autoreq --no_uninstall
* autoreq --no-uninstall
* autoreq --uninstall=0
* autoreq --nu

Default: execute all uninstall commands.

### --save, --no-save

Use --save/--no-save flag in npm install commands.

Variations for --no-save:

* autoreq --save=0
* autoreq --no-save
* autoreq --no_save

Variations for --save:

* autoreq --save=1
* autoreq --save

Default: save all packages that isn't in package.

If save flag set and there is package installed as dev dependency then *--save-dev* flag will be added.