$ = require 'jquery'

###
Engine to apply Myna UI style changesets to the current page.

A changeset is an array of `change` objects representing individual adjustments to the page.
`changes` take one of the following forms:

 - Hide an element      : { typename: 'hide',      location: locationSelector, selector: selector }
 - Change element text  : { typename: 'text',      location: locationSelector, selector: selector, text: string   }
 - Change element HTML  : { typename: 'html',      location: locationSelector, selector: selector, html: string   }
 - Change element style : { typename: 'css',       location: locationSelector, selector: selector, css: cssObject }
 - Change element attr  : { typename: 'attr',      location: locationSelector, selector: selector, name: string, value: string }
 - DOM event goal       : { typename: 'eventgoal', location: locationSelector, selector: selector, event: string }
 - Page load goal       : { typename: 'loadgoal',  location: locationSelector }

In each case, `selector` is a Sizzle selector describing a set of elements to change,
and `location` is an object that specifies the URL(s) on which the change should take effect.

The structure of a `locationPattern` is as follows:

  {
    scheme   : or(string,  undefined), // value of `window.location.scheme`   to match against
    hostname : or(string,  undefined), // value of `window.location.hostname` to match against
    port     : or(integer, undefined), // value of `window.location.port`     to match against
    pathname : or(string,  undefined)  // value of `window.location.path`     to match against
  }

Changes are created using an editor in the Myna UI and cached in the JSON settings for the relevant
experiment and variant. Myna JS looks for changes in all experiments in the deployment and and
applies any relevant changes to the page.
###

# Returns `true` if any of the `changes` apply to the current page (as specified by `loc`).
#
# `loc` is provided for testing purposes.
#
# arrayOf(change) [locationPattern] -> boolean
applicable = (changes, loc = window.location) ->
  for change in changes when _locationMatches(loc, change.location)
    return true
  return false

# Applies an array of changes to the current page (as specified by `doc` and `loc`) and
# returns a function to undo them again.
#
# `doc` and `loc` are provided for testing purposes.
#
# arrayOf(change) (event -> void) [element] [locationPattern] -> (-> void)
apply = (changes, goalHandler, doc = window.document, loc = window.location) ->
  # Array of undo functions:
  undo = []

  for change in changes when _locationMatches(loc, change.location)
    # Push the undo function onto the beginning of the array:
    undo.unshift(_applyOne(change, doc))

  # Return a function that undoes all changes in sequence:
  return ->
    for func in undo then func()
    return

# Applies a single change to the current page (as specified by `doc`) and returns
# a function to undo it again.
#
# `doc` and `loc` are provided for testing purposes.
#
# change [element] -> (-> void)
_applyOne = (change, doc = window.document) ->
  switch change.typename
    when 'hide'
      selection = $(doc).find(change.selector)
      selection.hide()
      return -> selection.show()

    when 'text'
      selection = $(doc).find(change.selector)
      original = selection.text()
      selection.text(change.text)
      return -> selection.text(original)

    when 'html'
      selection = $(doc).find(change.selector)
      original = selection.html()
      selection.html(change.html)
      return -> selection.html(original)

    when 'css'
      selection = $(doc).find(change.selector)
      original = selection.css()
      selection.css(change.css)
      return -> selection.css(original)

    when 'attr'
      selection = $(doc).find(change.selector)
      original = selection.attr(change.name)
      selection.attr(change.name, change.value)
      return -> selection.attr(change.name, original)

    when 'eventgoal'
      $(doc).on(change.event, change.selector, goalHandler)
      return -> $(doc).off(change.event, change.selector, goalHandler)

    when 'loadgoal'
      $(window).on('load', goalHandler)
      return -> $(window).off('load', goalHandler)

    else throw new Error("Invalid change type: #{options}")

# location locationPattern -> boolean
_locationMatches = (location, pattern) ->
  # TODO: Prefix matching on paths, subdomain matching on hosts:
  (if pattern.scheme   then location.scheme   == pattern.scheme   else true) &&
  (if pattern.hostname then location.hostname == pattern.hostname else true) &&
  (if pattern.port     then location.port     == pattern.port     else true) &&
  (if pattern.pathname then location.pathname == pattern.pathname else true)

module.exports = {
  applicable
  apply
}