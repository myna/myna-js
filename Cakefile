fs     = require 'fs'
{exec} = require 'child_process'

task "compile", "Compile the CS files into individual JS files", ->
  exec 'coffee --compile --output lib/ src/', (err, stdout, stderr) ->
    throw err if err
    console.log stdout + stderr


appFiles  = [
  # omit src/ and .coffee to make the below lines a little shorter
  'intro'
  'log'
  'util'
  'jsonp'
  'basic'
]

task 'compile-lib', 'Build single application file from source files', ->
  appContents = new Array remaining = appFiles.length
  for file, index in appFiles then do (file, index) ->
    fs.readFile "src/#{file}.coffee", 'utf8', (err, fileContents) ->
      throw err if err
      appContents[index] = fileContents
      process() if --remaining is 0
  process = ->
    fs.writeFile 'lib/myna.coffee', appContents.join('\n\n'), 'utf8', (err) ->
      throw err if err
      exec 'coffee --compile lib/myna.coffee', (err, stdout, stderr) ->
        throw err if err
        console.log stdout + stderr
        fs.unlink 'lib/myna.coffee', (err) ->
          throw err if err
          console.log 'Done.'

task "compile-lib", "Compile the Myna CS files into a single JS file"