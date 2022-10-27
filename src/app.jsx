import React from 'react'
import Map from './map'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showingMap: false,
      atCurrentLocation: false,
      map: null
    }
    this.handleShowMapClick = this.handleShowMapClick.bind(this)
    this.handleMapState = this.handleMapState.bind(this)
    this.setCurrentLocation = this.setCurrentLocation.bind(this)
  }

  handleMapState(map) {
    this.setState({
      map: map
    })
  }

  handleShowMapClick(event) {
    this.setState({
      showingMap: true
    })
  }

  setCurrentLocation(event) {
    window.navigator.geolocation.getCurrentPosition((position) => {
      this.state.map.setCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    });
  }

  render() {
    const button = (this.state.showingMap) && <button onClick={this.setCurrentLocation}>Set Current Location</button>

    return(
      <div>
        <h3>My Google Maps Demo</h3>
        <div id="map">{<Map {...this.state} handleShowMapClick={this.handleShowMapClick} handleMapState={this.handleMapState}/>}</div>
        {button}
      </div>
    )
  }
}
