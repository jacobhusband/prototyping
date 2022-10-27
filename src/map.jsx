import React from 'react'

export default class Map extends React.Component{
  constructor(props) {
    super(props)
    this.showMap = this.showMap.bind(this)
  }

  showMap(event) {
    const map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 33.634929, lng: -117.7405074 },
      zoom: 18,
      minZoom: 15,
      maxZoom: 21,
    });
    const drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.MARKER,
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
    drawingManager.setMap(map);
    this.props.handleMapState(map);
  }

  render() {
    return (
      <button onClick={(event) => {this.props.handleShowMapClick(event); this.showMap(event)}}>Open Map</button>
    )
  }
}
