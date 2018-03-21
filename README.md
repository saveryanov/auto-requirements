# auto-requirements

Autoreq is a program that allows to search in current directory all requirement packages and install them via npm.

## Install

You can install it by npm:

```
npm install -g auto-requirements
```

## Usage

Scan current directory and installing all found packages and uninstall unused dependencies:

```
autoreq
```

If you don't want to install packages and only need to display list use --no_install param:

```
autoreq --no_install
```


If you don't want to uninstall unused packages and only need to display list use --no_uninstall param:

```
autoreq --no_install
```
