const Dijkstra = require('../utils/dijkstra')
const GraphIndexer = require('../utils/graphIndexer')
const mockGraph = require('./graphData.json')

test('The algorithm finds the shortest path correctly', () => {
  const d = new Dijkstra(1258693808, mockGraph, 6660382003)
  const path = d.getPath()
  expect(path).toEqual([
    [60.4490843, 22.2617759], [60.4490514, 22.2616789], [60.4490386, 22.2615838],
    [60.4489977, 22.2614589], [60.4489569, 22.261355], [60.4489419, 22.2613454],
    [60.4489304, 22.2613429], [60.4488695, 22.2614278], [60.4488526, 22.2613725]
  ])
})