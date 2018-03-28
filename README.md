# auto-requirements

Autoreq is a command line utility that allows to parse js files in current directory to find used packages and install them or uninstall unused ones.

It will ignore js files in node_modules folder.

## Install

You can install it by npm:

```
npm install -g auto-requirements
```

## Usage

To scan current directory and installing all found packages and uninstall unused dependencies execute this in command line:

```
autoreq
```

## Params

### no_install

Install packages and only need to display list. Variations: 

* autoreq --no_install
* autoreq --no-install
* autoreq --install=0
* autoreq --ni

Default: true.

### no_uninstall

Uninstall unused packages and only need to display list. Variations: 

* autoreq --no_uninstall
* autoreq --no-uninstall
* autoreq --uninstall=0
* autoreq --nu

Default: true.

### install_exact

If package.json has exact version of package, then install it. Save property will be added only if this package isn't in package.json.

* --install_exact
* --install-exact
* --ie

Default: false.

### save_exact

Use --save-exact flag in npm install commands. Variations:

* --save_exact
* --save-exact
* --E

Default: false.

### no-save

Use --save/--no-save flag in npm install commands. Variations:

* --save=0
* --save=1
* --no-save
* --save

Default: true.