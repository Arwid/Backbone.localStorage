###!
Backbone localStorage Adapter v1.0
https://github.com/Arwid/Backbone.localStorage
###

###
LocalStore adds *localStorage*-based persistence to a Backbone collection
Dependencies: Underscore.js
* Backbone.js is not a hard dependency
###
class window.LocalStore
  
  modelIdAttribute = "id" # for easy referencing
  
  constructor: (@collection, @name) ->
    
    # Setup Sync
    @collection.sync = _CRUD_Sync
    @collection.model::sync = _CRUD_Sync
    @collection.store = this # bidirectional
    
    # Get ID Attribute for model creation
    modelIdAttribute = @collection.model::idAttribute
    
    # Get Records from *localStorage*
    store = localStorage.getItem(@name)
    @records = (store and store.split(",")) or []
    
  ### 
  PUBLIC CRUD Methods
  ###
  
  # CREATE (Add) model giving it a (hopefully)-unique GUID, if it doesn't have 
  # one already
  create: (model) =>
    attributes = {}
    attributes[modelIdAttribute] = _guid() unless model.id
    
    model.set attributes
    @_save model
  
  # READ (Retrieve) a model by id
  find: (model) ->
    JSON.parse localStorage.getItem(@name + "-" + model.id)
  
  # READ (Retrieve) an array of all models currently in storage
  findAll: ->
    _.map @records, ((id) ->
      JSON.parse localStorage.getItem(@name + "-" + id)
    ), this
  
  # UPDATE model by replacing its copy in storage
  update: (model) ->
    @_save model
  
  # DELETE (Destroy) model from this store, returning it
  destroy: (model) ->
    localStorage.removeItem @name + "-" + model.id
    @records = _.reject(@records, (record_id) ->
      record_id == model.id.toString()
    )
    @_save()
    model
  
  ###
  EXTRA Methods
  ###
  
  # Clear *localstorage*
  clear: ->
    localStorage.removeItem @name
    _.each @records, $.proxy((todo) ->
      localStorage.removeItem @name + "-" + todo.id
    , this)
    @records = []
    
  ###
  PRIVATE Methods (by "_" convention)
  ###
  
  # Save the current state of the **store** to *localstorage*, optionally
  # saving a model
  _save: (model = undefined) =>
    @_saveModel model if model
    localStorage.setItem @name, @records.join(",")
    model

  # Save a model to *localstorage*
  _saveModel: (model) ->
    localStorage.setItem @name + "-" + model.id, JSON.stringify(model)
    unless _.include(@records, model.id.toString())
      @records.push model.id.toString() 
  
# Sync method to use instead of Backbone.sync which delegates to the model or
# collection's *store* property, which should be an instance of 'LocalStore''
_CRUD_Sync = (method, model, options, error) ->
  
  # Backwards compatibility with Backbone <= 0.3.3
  if typeof options == 'function'
    options = success: options, error: error
  
  store = model.store or model.collection.store
  switch method
    when "create"
      resp = store.create(model)
    when "read"
      resp = (if model.id then store.find(model) else store.findAll())
    when "update"
      resp = store.update(model)
    when "delete"
      resp = store.destroy(model)
  if resp
    options.success resp
  else
    options.error "Record not found"

# Generate four random hex digits.
_S4 = ->
  (((1 + Math.random()) * 0x10000) | 0).toString(16).substring 1
  
# Generate a pseudo-GUID by concatenating random hexadecimal.  
_guid_couch = ->
  S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4()

# Generate a pseudo-GUID using the BSON format for MongoDB.
_guid = ->
  S4() + S4() + S4() + S4() + S4() + S4()

# _.extend window.LocalStore.prototype, Backbone.Events

window.Store = LocalStore