import React from 'react'
import Map from './map'

export default class App extends React.Component {
  render() {
    return(
      <div>
        <h3>My Google Maps Demo</h3>
        <div id="map">{<Map/>}</div>
      </div>
    )
  }
}
