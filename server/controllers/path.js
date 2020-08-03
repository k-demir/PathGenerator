const pathRouter = require('express').Router()
const Node = require('../models/Node')

pathRouter.get('/:lon/:lat/:length', async (req, res) => {
  const closeNodes = await Node.find({"coordinates": {
    "$near": {
        "$geometry": {
            "type": "Point",
            "coordinates": [req.params.lon, req.params.lat]
        },
        "$maxDistance": req.params.length/2
    }}})

  res.json(closeNodes)
})

module.exports = pathRouter