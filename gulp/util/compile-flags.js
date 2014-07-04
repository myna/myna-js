var flags = {
  minify: false,
  watch: false
};

module.exports = {
  get: function(name) { return flags[name] || false; },
  set: function(name, value) { flags[name] = value; }
};
