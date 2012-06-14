/**
 * Myna Basic Javascript Client v0.1
 * Copyright 2011 Untyped Ltd
 */

// Utility functions ---------------------------------------

function extend(dest, src) {
  for(name in src) {
    if(src[name] && !dest[name]) {
      dest[name] = src[name];
    }
  }
  return dest;
}
