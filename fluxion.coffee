class Fluxion extends Marionette.Object
  @_lastID = 1
  @_prefix = "Fluxion_"

  initialize: ->
    @_callbacks = {}
    @_isPending = {}
    @_isHandled = {}
    @_isDipatching = false
    @_pendingPayload = null

  register: (fn) ->
    id = "#{@_prefix}#{@_lastID++}";
    @_callbacks[id] = fn
    id

  unregister: (id) ->
    throw new Error("Fluxion.unregister(#{id}): does not map to a registered callback.") unless @_callbacks[id]?
    delete @_callbacks[id]

  waitFor: (ids) ->
    throw new Error("Fluxion.waitFor(): must be invoked while dispatching.") unless @_isDipatching
    for id in ids
      if @_isPending(id)
        throw new Error("Fluxion.waitFor(...): circular dependency detected while waiting for `#{id}`.") unless @_isHandled[id]
        continue
      throw new Error("Fluxion.waitFor(...): `#{id}` does not map to a registered callback.") unless @_callbacks[id]?
      @_invokeCallback(id)

  dispatch: (payload) ->
    throw new Error("Fluxion.dispatch(): cannot dispatch in the middle of a dispatch.") if @_isDipatching
    @_startDispatching(payload)
    try
      for id in @_callbacks
        continue if @_isPending(id)
        @_invokeCallback(id)
    finally
      @_stopDispatching()

  isDispatching: -> @_isDispatching

  _invokeCallback: (id) ->
    @_isPending[id] = true
    @_callbacks[id](@_pendingPayload)
    @_isHandled[id] = true

  _startDispatching: (payload) ->
    for id in @_callbacks
      @_isPending[id] = false
      @_isHandled[id] = false

    @_pendingPayload = payload
    @_isDipatching = true

  _stopDispatching: ->
    @_pendingPayload = null
    @_isDipatching = false
