import React from 'react'

export default class Map extends React.Component{
  constructor(props) {
    super(props)
    this.showMap = this.showMap.bind(this)
    this.map = null;
  }

  showMap(event) {
    console.log(this.props)
    this.map = new google.maps.Map(document.getElementById("map"), {
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
    drawingManager.setMap(this.map);
  }

  render() {
    return (
      <button onClick={(event) => {this.props.handleShowMapClick; this.showMap}}>Open Map</button>
    )
  }
}
