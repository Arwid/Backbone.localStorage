(function() {
  /*!
  Backbone localStorage Adapter v1.0
  https://github.com/Arwid/Backbone.localStorage/tree/coffeescript
  */
  /*
  LocalStore adds *localStorage*-based persistence to a Backbone collection
  Dependencies: Underscore.js
  * Backbone.js is not a hard dependency
  */
  var _CRUD_Sync, _S4, _guid, _guid_couch;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  window.LocalStore = (function() {
    var modelIdAttribute;
    modelIdAttribute = "id";
    function LocalStore(collection, name) {
      var store;
      this.collection = collection;
      this.name = name;
      this._save = __bind(this._save, this);
      this.create = __bind(this.create, this);
      this.collection.sync = _CRUD_Sync;
      this.collection.model.prototype.sync = _CRUD_Sync;
      this.collection.store = this;
      modelIdAttribute = this.collection.model.prototype.idAttribute;
      store = localStorage.getItem(this.name);
      this.records = (store && store.split(",")) || [];
    }
    /* 
    PUBLIC CRUD Methods
    */
    LocalStore.prototype.create = function(model) {
      var attributes;
      attributes = {};
      if (!model.id) {
        attributes[modelIdAttribute] = _guid();
      }
      model.set(attributes);
      return this._save(model);
    };
    LocalStore.prototype.find = function(model) {
      return JSON.parse(localStorage.getItem(this.name + "-" + model.id));
    };
    LocalStore.prototype.findAll = function() {
      return _.map(this.records, (function(id) {
        return JSON.parse(localStorage.getItem(this.name + "-" + id));
      }), this);
    };
    LocalStore.prototype.update = function(model) {
      return this._save(model);
    };
    LocalStore.prototype.destroy = function(model) {
      localStorage.removeItem(this.name + "-" + model.id);
      this.records = _.reject(this.records, function(record_id) {
        return record_id === model.id.toString();
      });
      this._save();
      return model;
    };
    /*
      EXTRA Methods
      */
    LocalStore.prototype.clear = function() {
      localStorage.removeItem(this.name);
      _.each(this.records, $.proxy(function(todo) {
        return localStorage.removeItem(this.name + "-" + todo.id);
      }, this));
      return this.records = [];
    };
    /*
      PRIVATE Methods (by "_" convention)
      */
    LocalStore.prototype._save = function(model) {
      if (model == null) {
        model = void 0;
      }
      if (model) {
        this._saveModel(model);
      }
      localStorage.setItem(this.name, this.records.join(","));
      return model;
    };
    LocalStore.prototype._saveModel = function(model) {
      localStorage.setItem(this.name + "-" + model.id, JSON.stringify(model));
      if (!_.include(this.records, model.id.toString())) {
        return this.records.push(model.id.toString());
      }
    };
    return LocalStore;
  })();
  _CRUD_Sync = function(method, model, options, error) {
    var resp, store;
    if (typeof options === 'function') {
      options = {
        success: options,
        error: error
      };
    }
    store = model.store || model.collection.store;
    switch (method) {
      case "create":
        resp = store.create(model);
        break;
      case "read":
        resp = (model.id ? store.find(model) : store.findAll());
        break;
      case "update":
        resp = store.update(model);
        break;
      case "delete":
        resp = store.destroy(model);
    }
    if (resp) {
      return options.success(resp);
    } else {
      return options.error("Record not found");
    }
  };
  _S4 = function() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  _guid_couch = function() {
    return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
  };
  _guid = function() {
    return S4() + S4() + S4() + S4() + S4() + S4();
  };
  window.Store = LocalStore;
}).call(this);
