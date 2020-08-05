require('dotenv').config()
const mongoose = require('mongoose')
const pathUtils = require('../utils/pathUtils')

describe('Closest point', () => {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true, useUnifiedTopology: true
  })

  test('the closest point is correctly returned', async (done) => {
    const node = await pathUtils.closestNode(22.276680, 60.455801)
    expect(node['_id']).toBe(315871743)
    done()
  })

  afterAll(() => {
    mongoose.connection.close()
  })
})