import React, { useState } from 'react'
import Map from './components/Map'
import { shortestPath } from './services/path'
import Toolbar from './components/Toolbar'
import Loading from './components/Loading'

const App = () => {
  const [path, setPath] = useState([])
  const [waypoints, setWaypoints] = useState([])
  const [lon, setLon] = useState(22.2650)
  const [lat, setLat] = useState(60.4520)
  const [len, setLen] = useState(0)
  const [loading, setLoading] = useState(false)
  const [firstClick, setFirstClick] = useState(true)
  const [reset, setReset] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const createPath = async (toLon, toLat) => {
    setLoading(true)
    const res = await shortestPath(lon, lat, toLon, toLat)
    if (Number(res.dist) !== Infinity) {
      if (waypoints.length === 0) {
        setWaypoints([res.path[0], res.path[res.path.length - 1]])
      } else {
        setWaypoints(waypoints.concat([res.path[res.path.length - 1]]))
      }
      setPath(path.concat(res.path))
      setLen(len + Number(res.dist))
      setLon(toLon)
      setLat(toLat)
    } else {
      setErrorMsg('Error: could not find a path.')
      setTimeout(() => {
        setErrorMsg('')
      }, 5000);
    }
    setLoading(false)
  }

  const setFirstPoint = (toLon, toLat) => {
    setFirstClick(false)
    setLon(toLon)
    setLat(toLat)
  }

  const resetPath = () => {
    setFirstClick(true)
    setPath([])
    setWaypoints([])
    setLen(0)
    setReset(!reset)
  }

  return (
    <div className="App">
      <div id='topDiv'>
        <h1 id='title'>Shortest path finder</h1>
        <Toolbar len={len} resetPath={resetPath} firstClick={firstClick} 
          setFirstPoint={setFirstPoint} errorMsg={errorMsg} />
      </div>
      {loading
        ? <Loading />
        : <Map path={path} lon={lon} lat={lat} createPath={createPath}
         setFirstPoint={setFirstPoint} firstClick={firstClick} reset={reset}
         waypoints={waypoints}/>
      }
    </div>
  )
}

export default App