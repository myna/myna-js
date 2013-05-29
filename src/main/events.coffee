class Myna.Events extends Myna.Logging
  directAttributes: []

  # string => any
  get: (name) =>
    if @constructor::directAttributes.indexOf(name) >= 0
      this[name]
    else
      @getCustom(name)

  getCustom: (name) =>
    @error("get", "property not found: #{name}")

  # (object -> this) OR (string any -> this)
  set: (arg1, arg2) =>
    setDirect = (name, value) =>
      this[name] = value
      @trigger("change:#{name}", this, value)

    setOne = (name, value) =>
      if @constructor::directAttributes.indexOf(name) >= 0
        this[name] = value
        @trigger("change:#{name}", this, value)
      else
        @setCustom(name, value)

    # Handle set(name, value) and set(object) call styles:
    if typeof arg1 == "object"
      for name, value of arg1 then setOne(name, value)
    else
      setOne(arg1, arg2)

    @trigger("change", this)

    this

  setCustom: (name, value) =>
    @error("set", "property not found: #{name}")

  # Trigger the named event with the specified arguments.
  #
  # string any ... -> undefined
  trigger: (event, args...) =>
    @log("trigger", event, args...)

    unless @eventHandlers then @eventHandlers = {}

    cancel = false
    for handler in (@eventHandlers?[event] ? [])
      cancel = cancel || (handler.apply(this, args) == false)

    if cancel then false else undefined

  # Trigger the named event with the specified arguments, in a continuation passing style.
  #
  # Each handler is passed a success callback and an error callback, allowing it choose
  # whether to pass control to the next handler or signal an error.
  #
  # If all handlers indicate success, triggerAsync calls its success argument.
  # Otherwise it calls its error argument.
  #
  # string any ... (-> any) (-> any) -> undefined
  triggerAsync: (event, args..., success, error) =>
    @log("triggerAsync", event, args...)

    unless @eventHandlers then @eventHandlers = {}

    triggerAll = (handlers) =>
      @log("triggerAsync.triggerAll", handlers)
      if handlers.length == 0
        success()
      else
        [ head, rest... ] = handlers
        head.call this, args..., (=> triggerAll(rest)), error

    triggerAll(@eventHandlers[event] ? [])

  on: (events, handler) =>
    unless @eventHandlers then @eventHandlers = {}

    for event in events.split(/[ ]+/)
      handlers = @eventHandlers[event] ? []
      @eventHandlers[event] = handlers.concat([ handler ])
      @log("on", event, handler, @eventHandlers[event])
    return

  off: (events, handler) =>
    unless @eventHandlers then @eventHandlers = {}

    if events?
      for event in events.split(/[ ]+/)
        switch arguments.length
          when 1 then delete @eventHandlers[arguments[0]]
          else
            [ event, handler ] = arguments
            if (handlers = @eventHandlers[event])
              @eventHandlers[event] = for h in handlers when h != handler then h
        @log("off", event, handler, @eventHandlers[event])
    else
      @eventHandlers = {}
      @log("off", "all")
    return
