myna-js
=======

Javascript client for Myna

The packaged library is in the `dist` directory. Choose minified or not as the urge takes you.

# Documentation

See the [wiki](https://github.com/myna/myna-js/wiki). Very much in progress.

# TODO

- Add sensible defaults for unnecessary callbacks (error in suggest, success and error in reward)
- Add function to make rewarding a link simple
- Change Myna server to respond to JSONP requests with a 200 OK on error. This will allow us to parse the error and fix the currently failing test.
- Finish document


# Developing

This project uses [Grunt](https://github.com/cowboy/grunt) as its build tool. You should see the Grunt website for full install instructions. If you have Node.js and npm installed, you should be able to install grunt with `npm install -g grunt`.

You also need [CoffeeScript](http://coffeescript.org/), which you can install with `npm install -g coffee-script`.

To run the tests you will need to install [PhantomJS](http://code.google.com/p/phantomjs/downloads/list).

The main commands you'll want to use are:

- `grunt compile` to create `lib/myna.js`
- `grunt test` to run the tests
- `grunt package` to create the minified and unminified libraries in `dist`

**NOTE** Tests are currently failing waiting deployment of a server-side change. Use `grunt --force` to build the library with failing tests.
