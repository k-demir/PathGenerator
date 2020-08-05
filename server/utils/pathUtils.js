const mongoose = require('mongoose')
const Node = require('../models/Node')
const Dijkstra = require('./dijkstra')

const earthRadius = 6371000

const createPath = async (startLon, startLat, length) => {
  const startNode = await closestNode(startLon, startLat)

  const targets = await potentialTargets(startLon, startLat, length/3-200, length/3)
  const randomTarget = targets[Math.floor(Math.random() * targets.length)]
  let randomTarget2 
  
  do {
    randomTarget2 = targets[Math.floor(Math.random() * targets.length)]
  } while (randomTarget2 === randomTarget || randomTarget2 === startNode)

  const waypointList = [startNode, randomTarget, randomTarget2, startNode]
  let path = []
  let dist = 0

  for (let i = 0; i < waypointList.length - 1; i++) {
    let c = [...waypointList[i]['coordinates'], ...waypointList[i+1]['coordinates']]
    let m = coordinateMidPoint(...c)
    let l = coordinatesToDistance(...c)
    let newGraph = await closestNodes(...m, l/2+200)
    let dijkstra = new Dijkstra(waypointList[i]['_id'], newGraph, waypointList[i+1]['_id'])
    path.push(...dijkstra.getPath())
    dist += dijkstra.getDistance()
  }

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
  const node = await Node.findOne({"coordinates": {
    "$near": {
        "$geometry": {
            "type": "Point",
            "coordinates": [lon, lat]
        }
    }}})
  return node
}

const potentialTargets = async (lon, lat, minDist, maxDist) => {
  const nodes = await Node.find({"coordinates": {
    "$near": {
        "$geometry": {
            "type": "Point",
            "coordinates": [lon, lat]
        },
        "$minDistance": minDist,
        "$maxDistance": maxDist
    }}})
    return nodes
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

const radToDeg = (rad) => {
  return 180 * rad / Math.PI
}

module.exports = { createPath, closestNode, closestNodes }