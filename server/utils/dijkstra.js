const FibonacciHeap = require('./fibonacciHeap')
const GraphIndexer = require('./graphIndexer')

class Dijkstra {
  constructor(sourceNode, graph, targetNode = null) {
    this.sourceNode = sourceNode
    this.graph = graph
    this.targetNode = targetNode
    this.graphIndexer = new GraphIndexer(graph)
    this.dist = new Array(graph.length).fill(Infinity)
    this.prev = new Array(graph.length).fill(null)

    const priorityQueue = new FibonacciHeap()
    const nodes = new Array(graph.length).fill(null)
    this.dist[this.graphIndexer.getIndex(this.sourceNode)] = 0
    
    for (let node of this.graph) {
      let nodeIdx = this.graphIndexer.getIndex(node['_id'])
      const ref = priorityQueue.push(this.dist[nodeIdx], nodeIdx)
      nodes[nodeIdx] = ref
    }

    while (!priorityQueue.isEmpty()) {
      let currentNode = priorityQueue.popMinimum()
      if (targetNode !== null && this.graphIndexer.getId(currentNode.key) === targetNode)
        break
      for (let neighbor of this.graph[currentNode.key]['edges']) {
        const neighborIdx = this.graphIndexer.getIndex(neighbor['connected_id'])
        const newDist = this.dist[currentNode.key] + neighbor['distance']
        if (newDist < this.dist[neighborIdx]) {
          this.dist[neighborIdx] = newDist
          this.prev[neighborIdx] = currentNode.key
          priorityQueue.decreaseValue(nodes[neighborIdx], newDist)
        }
      }
    }
  }

  getPath(targetNode = null) {
    if (targetNode === null) {
      targetNode = this.targetNode
    }
    let path = []
    let idx = this.graphIndexer.getIndex(targetNode)
    if (this.prev[idx] !== null || targetNode === this.sourceNode) {
      while (idx) {
        path.push(idx)
        idx = this.prev[idx]
      }
    }
    path.push(this.graphIndexer.getIndex(this.sourceNode))
    return path.map(idx => this.graphIndexer.getCoordinates(idx)).reverse()
    }

  getDistance(targetNode = null) {
    if (targetNode === null) {
      targetNode = this.targetNode
    }
    let idx = this.graphIndexer.getIndex(targetNode)
    return this.dist[idx]
  }
}

module.exports = Dijkstra