import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/path'

export const generatePath = async (lon, lat, length) => {
  const res = await axios.get(`${baseUrl}/${lon}/${lat}/${length}`)
  return res.data
}

export const shortestPath = async (lon1, lat1, lon2, lat2) => {
  const res = await axios.get(`${baseUrl}/${lon1}/${lat1}/${lon2}/${lat2}`)
  return res.data
}