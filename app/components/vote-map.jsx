// import React, { PropTypes } from 'react'
import React from 'react';
import {Map, Marker, Popup, TileLayer} from 'react-leaflet';
import L from 'leaflet';


const myIcon = L.icon({
  iconUrl: '../images/mic-green.png',
  iconSize: [52.8, 46.8]
});

class Lmap extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      zoom: 12
    }
  }

  render () {
    console.log('this.props.position', this.props.position);
    return (
        <Map center={this.props.position} zoom={this.state.zoom}>
          <TileLayer
            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
        <Marker position={this.props.position} icon={myIcon}>
            <Popup>
              <span> Your vote is here! </span>
            </Popup>
          </Marker>
        </Map>
    )
  }
}

export default Lmap
