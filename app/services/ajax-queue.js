import Ember from 'ember';
var Service = Ember.Service;

export default Service.extend({
  _pending: false,
  _requests: [],

  init() {
    this._super.apply(this, arguments);
    window.onbeforeunload = function() {
      if (this._pending) {
        return 'Changes are being saved to the server. They may be lost if you leave now.';
      }
    }
  },

  add(callback) {
    var deferred = new Ember.RSVP.defer();
    this._requests.push({
      deferred: deferred,
      callback: callback
    });

    if (!this._pending){
      this._requestNext();
    }
    return deferred.promise;
  },

  _requestNext() {
    this._pending = true;
    var next = this._requests.shift();
    if (next) {
      return this._request(next);
    } else {
      return this._pending = false;
    }
  },

  _request(request) {
    return (request.callback()).then(function() {
      request.deferred.resolve.apply(this, arguments);
    }).catch(function() {
      request.deferred.reject.apply(this, arguments);
    }).finally(function() {
      return this._requestNext();
    }.bind(this));
  }
});
