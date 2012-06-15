myna-js
=======

Javascript client for Myna

The packaged library is in the `dist` directory. Choose minified or not as the urge takes you.

# TODO

- Expose functions to save suggestions in a cookie
- Add function to make rewarding a link simple
- Change Myna server to respond to JSONP requests with a 200 OK on error. This will allow us to parse the error and fix the currently failing test.
- Document


# Developing

This project use [Grunt](https://github.com/cowboy/grunt) as its build tool. You should see the Grunt website for full install instructions. If you have Node.js and npm installed, you should be able to install grunt with `npm install -g grunt`.

You also need [CoffeeScript](http://coffeescript.org/), which you can install with `npm install -g coffee-script`.

To run the tests you will need to install [PhantomJS](http://code.google.com/p/phantomjs/downloads/list).

The main commands you'll want to use are:

- `grunt compile` to create `lib/myna.js`
- `grunt test` to run the tests
- `grunt package` to create the minified and unminified libraries in `dist`
