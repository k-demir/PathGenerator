const mongoose = require('mongoose')

const edgeSchema = mongoose.Schema({
  connected_id: mongoose.Schema.Types.ObjectId,
  distance: Number
})

const nodeSchema = mongoose.Schema({
  _id: Number,
  coordinates: [Number],
  edges: [edgeSchema]
})

module.exports = mongoose.model('Node', nodeSchema)
