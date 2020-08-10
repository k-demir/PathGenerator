class GraphIndexer {
  #idxToId = {}
  #idToIdx = {}
  #idToCoords = {}

  constructor(graph) {
    for (const [idx, val] of graph.entries()) {
      this.#idxToId[idx] = val['_id']
      this.#idToIdx[val['_id']] = idx
      this.#idToCoords[idx] = [val['coordinates'][1], val['coordinates'][0]]
    }
  }

  getId(index) {
    return this.#idxToId[index]
  }

  getIndex(id) {
    return this.#idToIdx[id]
  }

  getCoordinates(idx) {
    return this.#idToCoords[idx]
  }
}

module.exports = GraphIndexer