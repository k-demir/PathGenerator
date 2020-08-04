const mongoose = require('mongoose')

const edgeSchema = mongoose.Schema({
  connected_id: Number,
  distance: Number
})

const nodeSchema = mongoose.Schema({
  _id: Number,
  coordinates: [Number],
  edges: [edgeSchema]
})

module.exports = mongoose.model('Node', nodeSchema)
