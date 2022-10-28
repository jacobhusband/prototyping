import React from 'react'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showingMap: false,
      atCurrentLocation: false,
      coordinates: [],
      distance: 0,
      pathCompleted: false
    }
    this.handleShowMapClick = this.handleShowMapClick.bind(this)
    this.setCurrentLocation = this.setCurrentLocation.bind(this)
    this.mapDivRef = React.createRef()
    this.showMap = this.showMap.bind(this);
  }

  showMap(event) {
    this.map = new google.maps.Map(this.mapDivRef.current, {
      center: { lat: 33.634929, lng: -117.7405074 },
      zoom: 18,
      minZoom: 15,
      maxZoom: 21,
    });
    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: null,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [google.maps.drawing.OverlayType.POLYLINE],
      },
      polylineOptions: {
        editable: false,
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
      this.drawingManager.setMap(null)
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
        pathCompleted: true
      })
    });
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
    });
  }

  render() {
    const currentLocationButton = (this.state.showingMap) && <button onClick={this.setCurrentLocation}>Set Current Location</button>

    const openMapButton = (!this.state.showingMap) && <button
          onClick={(event) => {
            this.handleShowMapClick(event);
            this.showMap(event);
          }}
        >
          Open Map
        </button>

    return(
      <div>
        <h3>My Google Maps Demo</h3>
        {openMapButton}
        <div className='map' ref={this.mapDivRef}/>
        {currentLocationButton}
        {<FinishedModal finished={this.state.pathCompleted}/>}
      </div>
    )
  }
}

function FinishedModal(props) {
  const modalClass = (props.finished) ? 'flex-centered full-screen modal-background' : 'hidden flex-centered full-screen modal-background'

  return (
    <div className={modalClass}>
      <div className='modal flex-centered flex-col'>
        <h3>Do you need to edit?</h3>
        <form className='buttons'>
          <button>Yes</button>
          <button>No</button>
        </form>
      </div>
    </div>
  )
}
