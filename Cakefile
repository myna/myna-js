fs     = require 'fs'
{exec} = require 'child_process'

mynaFiles  = [
  # omit src/ and .coffee to make the below lines a little shorter
  'intro'
  'log'
  'util'
  'config'
  'jsonp'
  'basic'
]

# Concatenate app files into lib/myna.coffee
# kont is the continuation
#
# When was manual CPS a good idea?
concatApp = (kont) ->
  appContents = new Array remaining = mynaFiles.length
  console.log('Concatenating files')
  for file, index in mynaFiles then do (file, index) ->
    fs.readFile "src/#{file}.coffee", 'utf8', (err, fileContents) ->
      throw err if err
      appContents[index] = fileContents
      process() if --remaining is 0
  process = ->
    console.log('Writing concatenated output')
    fs.writeFile 'lib/myna.coffee', appContents.join('\n\n'), 'utf8', (err) ->
      throw err if err
      kont()

# Compile lib/myna.coffee => lib/myna.js
#
# Returns a thunk that can be passed to concatApp
compileLib = (options) ->
  ->
    console.log("Compiling lib/myna.coffee with options: #{options}")
    exec "coffee #{options} --compile lib/myna.coffee", (err, stdout, stderr) ->
      throw err if err
      console.log stdout + stderr
      fs.unlink 'lib/myna.coffee', (err) ->
        throw err if err
        console.log 'Done.'

task 'compile-lib', 'Build single application file from source', ->
  console.log('Building Myna library')
  concatApp(compileLib(""))

# This is useful for tests
task 'compile-bare', 'Build single application file without scoping wrapper', ->
  console.log('Building bare Myna library')
  concatApp(compileLib("--bare --output spec"))
