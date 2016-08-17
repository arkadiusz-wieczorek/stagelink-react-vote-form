import React from 'react';
import {Map, Marker, Popup, TileLayer} from 'react-leaflet';
import L from 'leaflet';

class Lmap extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            zoom: 6,
            microphoneTag: L.icon({iconUrl: '../images/mic-green.png', iconSize: [52.8, 46.8] })
        }
    }

    render () {
        return (
            <Map center={this.props.position} zoom={this.state.zoom}>
                <TileLayer
                    url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors | &copy; <a href="http://stagelink.com">Powered by Stagelink.com</a>'/>
                <Marker
					position={this.props.position}
					icon={this.state.microphoneTag}>
	                    <Popup>
	                        <p> Your vote is here! </p>
	                    </Popup>
                </Marker>
            </Map>
        )
    }
}

export default Lmap;
