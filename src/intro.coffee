###
 Myna Javascript Client
 Copyright Untyped 2012
###

# Create container to hold all exported values
Myna = { onload: [], onsuggest: [], onreward: [] }
window.Myna = if window.Myna? then window.Myna else Myna