const pathRouter = require('express').Router()
const Node = require('../models/Node')
const pathUtils = require('../utils/pathUtils')

pathRouter.get('/:lon/:lat/:length', async (req, res) => {
  const lon = req.params.lon
  const lat = req.params.lat
  const length = req.params.length
  const path = await pathUtils.createPath(lon, lat, length)
  res.json(path)
})

module.exports = pathRouter