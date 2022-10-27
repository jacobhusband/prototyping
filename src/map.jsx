import React from 'react'

export default class Map extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      showingMap: false
    }
  }

  render() {
    return (
      <button onClick={this.props.handleShowMapClick}>Open Map</button>
    )
  }
}
