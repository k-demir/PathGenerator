class GraphIndexer {
  #idxToId = {}
  #idToIdx = {}

  constructor(graph) {
    for (const [idx, val] of graph.entries()) {
      this.#idxToId[idx] = val['_id']
      this.#idToIdx[val['_id']] = idx
    }
  }

  getId(index) {
    return this.#idxToId[index]
  }

  getIndex(id) {
    return this.#idToIdx[id]
  }
}

module.exports = GraphIndexer