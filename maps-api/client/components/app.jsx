import React from 'react'
import { Loader } from "@googlemaps/js-api-loader";

const loader = new Loader({
  apiKey: "AIzaSyBeNi6X_3E2J4ElWyexqXHqL2ASL1xC2k4",
  version: "weekly",
  libraries: ["drawing","places"],
});

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
    this.onPlaceChanged = this.onPlaceChanged.bind(this);
    this.mapDivRef = React.createRef();
    this.autocompleteDivRef = React.createRef();
  }

  showMap(event) {
    loader.load().then(() => {
      this.map = new google.maps.Map(this.mapDivRef.current, {
        center: this.state.mapCenter,
        zoom: 18,
        minZoom: 17,
        maxZoom: 19,
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
      this.autocomplete = new google.maps.places.Autocomplete(
        this.autocompleteDivRef.current, {
          types: ['geocode'],
          componentRestrictions: {'country': ['USA']},
          fields: ['formatted_address', 'geometry', 'name'],
        }
      );
      this.autocomplete.addListener('place_changed', this.onPlaceChanged);
      google.maps.event.addListener(this.drawingManager, "overlaycomplete", (polygon) => {
        this.handlePolygonCalculations(polygon, true)
      });
    })
  }

  onPlaceChanged() {
    const place = this.autocomplete.getPlace();
    const coords = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    };
    this.map.setCenter(coords);
    this.setState({mapCenter: coords});
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

  render() {
    const currentLocationButton = (this.state.showingMap && !this.polygon) && <button onClick={this.setCurrentLocation}>Set Current Location</button>

    const enterLocation = (this.state.showingMap && !this.polygon) &&
    <>
      <p>or</p>
      <div className='location'>
        <input id='autocomplete' placeholder="search a location" type="text" ref={this.autocompleteDivRef}/>
      </div>
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
        {currentLocationButton}
        {enterLocation}
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
