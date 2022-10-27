import React from 'react'
import Map from './map'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      lat: null,
      lng: null,
      showingMap: false,
      atCurrentLocation: false
    }
    this.setCurrentLocation = this.setCurrentLocation.bind(this)
    this.handleShowMapClick = this.handleShowMapClick.bind(this)
  }

  setCurrentLocation(event) {
    window.navigator.geolocation.getCurrentPosition((position) => {
      this.map.setCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  }

  handleShowMapClick(event) {
    this.setState({
      showingMap: true
    })
  }

  render() {
    const button = (this.state.showingMap) && <button onClick={this.setCurrentLocation}>Set Current Location</button>

    return(
      <div>
        <h3>My Google Maps Demo</h3>
        <div id="map">{<Map {...this.state} handleShowMapClick={this.handleShowMapClick}/>}</div>
        {button}
      </div>
    )
  }
}
