const mongoose = require('mongoose')
const Node = require('../models/Node')
const Dijkstra = require('./dijkstra')

const earthRadius = 6371000

const findPath = async (lon1, lat1, lon2, lat2) => {
  const startNode = await closestNode(lon1, lat1)
  const targetNode = await closestNode(lon2, lat2)

  if (startNode['_id'] === targetNode['_id']) {
    return { path: [startNode.coordinates.reverse()], dist: 0}
  }

  const graph = await closestNodes(
      ...coordinateMidPoint(...startNode.coordinates, ...targetNode.coordinates, lat2), 
      coordinatesToDistance(...startNode.coordinates, ...targetNode.coordinates) + 1000
    )

  let dijkstra = new Dijkstra(startNode['_id'], graph, targetNode['_id'])
  let path = []
  let dist = []
  path.push(...dijkstra.getPath())
  dist += dijkstra.getDistance()

  return { path, dist }
}

const closestNodes = async (lon, lat, maxDist) => {
  const nodes = await Node.find({"coordinates": {
    "$near": {
        "$geometry": {
            "type": "Point",
            "coordinates": [lon, lat]
        },
        "$maxDistance": maxDist
    }}})
  return nodes
}

const closestNode = async (lon, lat) => {
  const nodes = await Node.find({"coordinates": {
    "$near": {
        "$geometry": {
            "type": "Point",
            "coordinates": [lon, lat]
        },
        "$maxDistance": 100
    }}})
  const closest = nodes.reduce(
    (c, n) => coordinatesToDistance(lon, lat, n.coordinates[0], n.coordinates[1]) < c[0]
      ? [coordinatesToDistance(lon, lat, n.coordinates[0], n.coordinates[1]), n]
      : c
  , [Infinity, nodes[0]])
  return closest[1]
}

const coordinateMidPoint = (sourceLon, sourceLat, targetLon, targetLat) => {
  // Approximates the result by assuming that the distances are short
  const midPointLon = (sourceLon + targetLon) / 2
  const midPointLat = (sourceLat + targetLat) / 2
  return [midPointLon, midPointLat]
}

const coordinatesToDistance = (sourceLon, sourceLat, targetLon, targetLat) => {
  const lat1 = degToRad(sourceLat)
  const lon1 = degToRad(sourceLon)
  const lat2 = degToRad(targetLat)
  const lon2 = degToRad(targetLon)
  h = Math.sin((lat2-lat1)/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin((lon2-lon1)/2)**2
  return Math.round((2*earthRadius*Math.asin(Math.sqrt(h)) + Number.EPSILON) * 100) / 100
}

const degToRad = (deg) => {
  return Math.PI * deg / 180
}

module.exports = { findPath, closestNode, closestNodes }