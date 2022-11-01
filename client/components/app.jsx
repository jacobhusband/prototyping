import React from 'react'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showingMap: false,
      atCurrentLocation: false,
      coordinates: [],
      distance: 0,
      pathCompleted: false,
      showEditModal: false,
      mapCenter: { lat: 33.634929, lng: -117.7405074 }
    }
    this.handleShowMapClick = this.handleShowMapClick.bind(this)
    this.setCurrentLocation = this.setCurrentLocation.bind(this)
    this.handlePathCompleted = this.handlePathCompleted.bind(this)
    this.showMap = this.showMap.bind(this);
    this.handleLocationInputs = this.handleLocationInputs.bind(this)
    this.mapDivRef = React.createRef()
  }

  showMap(event) {
    this.map = new google.maps.Map(this.mapDivRef.current, {
      center: this.state.mapCenter,
      zoom: 18,
      minZoom: 15,
      maxZoom: 21,
    });
    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYLINE,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [google.maps.drawing.OverlayType.POLYLINE],
      },
      polylineOptions: {
        editable: true,
        clickable: true,
      },
      circleOptions: {
        fillColor: "#ffff00",
        fillOpacity: 1,
        strokeWeight: 5,
        clickable: false,
        editable: true,
        zIndex: 1,
      },
    });
    this.drawingManager.setMap(this.map);
    google.maps.event.addListener(this.drawingManager, "overlaycomplete", (polygon) => {
      this.handlePolygonCalculations(polygon, true)
    });
  }

  handlePolygonCalculations(polygon, showEditModal) {
    this.polygon = polygon;
    const arr = polygon.overlay.getPath().getArray();
      const newCoords = []
      const newDistances = []
      arr.map((obj) => {
        newCoords.push({
          lat: obj.lat(),
          lng: obj.lng()
        })
      });
      for (var i = 1; i < newCoords.length; i++) {
        newDistances.push(this.findDistance(newCoords[i-1].lat, newCoords[i].lat, newCoords[i-1].lng, newCoords[i].lng));
      }
      this.setState({
        coordinates: newCoords,
        distance: newDistances.reduce((x,y) => x + y),
        pathCompleted: true,
        showEditModal: showEditModal
      })
  }

  handlePathCompleted(event) {
    if (event.target.name === 'yes') {
      this.setState({ pathCompleted: true,
                      showEditModal: false })
      this.polygon.overlay.setEditable(false)
      this.drawingManager.setMap(null)
    } else {
      this.setState({ pathCompleted: false,
                      showEditModal: false });
      this.drawingManager.setDrawingMode(null);
      this.drawingManager.setOptions({
        drawingControlOptions: {
        drawingModes: [],
      }
      });
    }
  }

  handleShowMapClick(event) {
    this.setState({
      showingMap: true
    })
  }

  findDistance(lat1, lat2, lng1, lng2) {
    lng1 = (lng1 * Math.PI) / 180;
    lng2 = (lng2 * Math.PI) / 180;
    lat1 = (lat1 * Math.PI) / 180;
    lat2 = (lat2 * Math.PI) / 180;

    let dlng = lng2 - lng1;
    let dlat = lat2 - lat1;
    let a = Math.pow(Math.sin(dlat / 2), 2)
          + Math.cos(lat1) * Math.cos(lat2)
          * Math.pow(Math.sin(dlng / 2),2);

    let c = 2 * Math.asin(Math.sqrt(a));
    let r = 6371;

    return(c * r);
  }

  setCurrentLocation(event) {
    window.navigator.geolocation.getCurrentPosition((position) => {
      this.map.setCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
      this.setState({
        mapCenter: {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      })
    });
  }

  handleLocationInputs(event) {
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${event.target.value}&types=park&location=${this.state.mapCenter.lat}%2C${this.state.mapCenter.lng}&radius=500&key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg`
    fetch(url).then(res => res.json()).then(data => console.log(data)).catch(err => console.error(err))
  }

  render() {
    const currentLocationButton = (this.state.showingMap && !this.polygon) && <button onClick={this.setCurrentLocation}>Set Current Location</button>

    const enterLocation = (this.state.showingMap && !this.polygon) &&
    <>
      <form className='location'>
        <label htmlFor="location">Enter a location</label>
        <input type="text" onChange={this.handleLocationInputs}/>
      </form>
      <p>or</p>
    </>

    const openMapButton = (!this.state.showingMap) &&
    <button onClick={(event) => {
            this.handleShowMapClick(event);
            this.showMap(event);
          }}> Show Map </button>

    const saveButton = (this.state.showingMap && this.polygon && !this.state.pathCompleted) && <button onClick={(event) => {this.handlePathCompleted(event); this.handlePolygonCalculations(this.polygon, false)}} name="yes" className='save'>Save</button>

    return(
      <div>
        <h3>My Google Maps Demo</h3>
        {openMapButton}
        <div className='map' ref={this.mapDivRef}/>
        {enterLocation}
        {currentLocationButton}
        {saveButton}
        {<FinishedModal modal={this.state.showEditModal} handlePathCompleted={this.handlePathCompleted}/>}
      </div>
    )
  }
}

function FinishedModal(props) {

  const modalClass = (props.modal) ? 'flex-centered full-screen modal-background' : 'hidden flex-centered full-screen modal-background'

  return (
    <div className={modalClass}>
      <div className='modal flex-centered flex-col'>
        <h3>Does the path look okay?</h3>
        <div className='buttons'>
          <button name='yes' onClick={props.handlePathCompleted}>Yes</button>
          <button name='no' onClick={props.handlePathCompleted}>No</button>
        </div>
      </div>
    </div>
  )
}
