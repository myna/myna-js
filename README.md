Javascript Client for Myna
==========================

Copyright 2012 Myna Ltd

Released under the [BSD 3-clause license](http://opensource.org/licenses/BSD-3-Clause).
See [LICENSE.md](https://github.com/myna/myna-js/blob/master/LICENSE.md) for the full text.

# What is this?

This is a Javascript client library for the [Myna](http://mynaweb.com) A/B testing platform.

# Getting started

If you're new to Myna, look at our [help pages](https://mynaweb.com/help/library-javascript) for instructions on how to get started. We also have a number of [demos](https://mynaweb.com/demo/js) showing common use cases.

See the project's [Github wiki](https://github.com/myna/myna-js/wiki) for a comprehensive API reference.

The latest versions of this library are hosted on our *content delivery network*. See our help for more information. You only need to use this Github repository if you want to contribute new features or bug fixes or build a custom version of the client.

# Developing

This project is written in [Coffeescript](http://coffeescript.org) and uses the [Grunt](https://github.com/cowboy/grunt) build tool. See the respective web sites for full manuals and installation instructions.

If you have Node.js and npm installed, you should be able to the necessary tools with:

    npm install -g grunt
    npm install -g coffee-script

The main command to build the library is then:

    grunt compile

which creates `dist/myna-x.y.z.js` and `dist/myna-x.y.z.min.js`.