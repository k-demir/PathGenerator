const pathRouter = require('express').Router()
const Node = require('../models/Node')
const pathUtils = require('../utils/pathUtils')

pathRouter.get('/:lon1/:lat1/:lon2/:lat2', async (req, res) => {
  const lon1 = req.params.lon1
  const lat1 = req.params.lat1
  const lon2 = req.params.lon2
  const lat2 = req.params.lat2
  const path = await pathUtils.findPath(lon1, lat1, lon2, lat2)
  res.json(path)
})

module.exports = pathRouter