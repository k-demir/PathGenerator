import React from 'react'

const Toolbar = ({ len, resetPath, firstClick, setFirstPoint, errorMsg }) => {

  const useCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      if (firstClick) {
        setFirstPoint(pos.coords.longitude, pos.coords.latitude)
      }
    })
  }

  return (
    <div>
      <span className='toolbarSpan'>
        Click on the map to select the 
        {firstClick ? 
        <> first location or 
        <button className='toolbarBtn' onClick={useCurrentLocation}>
          use current location
        </button></> : ' next location'
      }
        .
      </span>
      <br/>
      <span className='toolbarSpan'>
        Path length: {Math.round(len)} m
        <button className='toolbarBtn' onClick={resetPath}>
          Reset path
        </button>
      </span>
      <p style={{color: 'red'}}>{errorMsg}</p>
    </div>
  )
}

export default Toolbar