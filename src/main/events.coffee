class Myna.Events
  constructor: () ->
    @eventHandlers = {}

  # Trigger the named event with the specified arguments.
  #
  # string any ... -> undefined
  trigger: (event, args...) =>
    Myna.log("Myna.Events.trigger", event, args...)

    cancel = false
    for handler in (@eventHandlers[event] ? [])
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
    Myna.log("Myna.Events.triggerAsync", event, args...)

    triggerAll = (handlers) =>
      Myna.log("Myna.Events.triggerAsync.triggerAll", handlers)
      if handlers.length == 0
        success()
      else
        [ head, rest... ] = handlers
        head.call this, args..., (=> triggerAll(rest)), error

    triggerAll(@eventHandlers[event] ? [])

  on: (event, handler) =>
    @eventHandlers[event] = (@eventHandlers[event] ? []).concat([ handler ])
    Myna.log("Myna.Events.on", event, handler, @eventHandlers[event])

  off: (event, handler = null) =>
    switch arguments.length
      when 0 then @eventHandlers = {}
      when 1 then delete @eventHandlers[arguments[0]]
      else
        [ event, handler ] = arguments
        @eventHandlers[event] = for h in @eventHandlers[event] when h != handler then h
    Myna.log("Myna.Events.off", event, handler, @eventHandlers[event])
