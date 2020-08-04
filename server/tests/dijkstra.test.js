const Dijkstra = require('../utils/dijkstra')
const GraphIndexer = require('../utils/graphIndexer')
const mockGraph = require('./graphData.json')

test('The algorithm finds the shortest path correctly', () => {
  const d = new Dijkstra(1258693808, mockGraph)
  const path = d.getPath(6660382003)
  expect(path).toEqual([
    1258693808, 7182293482,1044249655, 1044249782, 7182293483, 
    1044249660, 7182321010,  382059208, 6660382003
  ])
})