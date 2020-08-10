import React, { useEffect, useRef } from 'react'
import L from 'leaflet'

const Map = ({ path, lon, lat, createPath, setFirstPoint, firstClick, reset, waypoints }) => {
  let map = useRef(null)

  useEffect(() => {
    if (map.current) {
      map.current.remove()
    }
    addMap()
  }, [reset]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (path && map.current) {
      L.polyline(path, {color: 'black', weight: 6}).addTo(map.current)
      L.polyline(path, {color: 'white', weight: 5}).addTo(map.current)
      L.polyline(path, {color: 'navy', weight: 3}).addTo(map.current)
    }
    for (let wp of waypoints) {
      addWaypoint(wp)
    }
  }, [path, waypoints])

  useEffect(() => {
    if (firstClick) {
      map.current.on('click', (e) => addFirstPoint(e))
    } else {
      map.current.off('click')
      map.current.on('click', (e) => addPoint(e))
    }
  }, [firstClick, lon, lat]) // eslint-disable-line react-hooks/exhaustive-deps

  const addMap = () => {
    map.current = L.map('map').setView([lat, lon], 14)
    L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.png', {
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> | Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
    }).addTo(map.current)
  }

  const addPoint = (e) => {
    createPath(e.latlng.lng, e.latlng.lat)
  }

  const addFirstPoint = (e) => {
    setFirstPoint(e.latlng.lng, e.latlng.lat)
    addWaypoint([e.latlng.lat, e.latlng.lng])
  }

  const addWaypoint = (coords) => {
    L.circleMarker(coords, {radius: 6, color: 'black'}).addTo(map.current)
    L.circleMarker(coords, {radius: 5, color: 'white'}).addTo(map.current)
    L.circleMarker(coords, {radius: 4, color: 'navy', fillOpacity: 1}).addTo(map.current)
  }

  return (
    <div id='map' className='mapElement' />
  )
}

export default Map