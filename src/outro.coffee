# Redefine onload.push to fire events immediately now that we've loaded
window.Myna.onload.push = (elts...) -> f() for f in elts


# Fire existing onload events
f() for f in window.Myna.onload