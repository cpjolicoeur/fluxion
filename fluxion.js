// Generated by CoffeeScript 1.9.0
(function() {
  var Fluxion, Marionette,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __hasProp = {}.hasOwnProperty;

  Marionette = require("backbone.marionette");

  Fluxion = (function(_super) {
    __extends(Fluxion, _super);

    function Fluxion() {
      return Fluxion.__super__.constructor.apply(this, arguments);
    }

    Fluxion._lastID = 1;

    Fluxion._prefix = "Fluxion_";

    Fluxion.prototype.initialize = function() {
      this._callbacks = {};
      this._isPending = {};
      this._isHandled = {};
      this._isDipatching = false;
      return this._pendingPayload = null;
    };

    Fluxion.prototype.register = function(fn) {
      var id;
      id = "" + this._prefix + (this._lastID++);
      this._callbacks[id] = fn;
      return id;
    };

    Fluxion.prototype.unregister = function(id) {
      if (this._callbacks[id] == null) {
        throw new Error("Fluxion.unregister(" + id + "): does not map to a registered callback.");
      }
      return delete this._callbacks[id];
    };

    Fluxion.prototype.waitFor = function(ids) {
      var id, _i, _len, _results;
      if (!this._isDipatching) {
        throw new Error("Fluxion.waitFor(): must be invoked while dispatching.");
      }
      _results = [];
      for (_i = 0, _len = ids.length; _i < _len; _i++) {
        id = ids[_i];
        if (this._isPending(id)) {
          if (!this._isHandled[id]) {
            throw new Error("Fluxion.waitFor(...): circular dependency detected while waiting for `" + id + "`.");
          }
          continue;
        }
        if (this._callbacks[id] == null) {
          throw new Error("Fluxion.waitFor(...): `" + id + "` does not map to a registered callback.");
        }
        _results.push(this._invokeCallback(id));
      }
      return _results;
    };

    Fluxion.prototype.dispatch = function(payload) {
      var id, _i, _len, _ref, _results;
      if (this._isDipatching) {
        throw new Error("Fluxion.dispatch(): cannot dispatch in the middle of a dispatch.");
      }
      this._startDispatching(payload);
      try {
        _ref = this._callbacks;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          id = _ref[_i];
          if (this._isPending(id)) {
            continue;
          }
          _results.push(this._invokeCallback(id));
        }
        return _results;
      } finally {
        this._stopDispatching();
      }
    };

    Fluxion.prototype.isDispatching = function() {
      return this._isDispatching;
    };

    Fluxion.prototype._invokeCallback = function(id) {
      this._isPending[id] = true;
      this._callbacks[id](this._pendingPayload);
      return this._isHandled[id] = true;
    };

    Fluxion.prototype._startDispatching = function(payload) {
      var id, _i, _len, _ref;
      _ref = this._callbacks;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        id = _ref[_i];
        this._isPending[id] = false;
        this._isHandled[id] = false;
      }
      this._pendingPayload = payload;
      return this._isDipatching = true;
    };

    Fluxion.prototype._stopDispatching = function() {
      this._pendingPayload = null;
      return this._isDipatching = false;
    };

    return Fluxion;

  })(Marionette.Object);

  module.exports = new Fluxion();

}).call(this);

//# sourceMappingURL=fluxion.js.map
