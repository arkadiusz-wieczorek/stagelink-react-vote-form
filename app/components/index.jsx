import React from 'react';
import ReactDOM from 'react-dom';
import reqwest from 'reqwest';
import merge from 'merge-object';
import classNames from 'classnames';

import VoteHeader from './vote-header.jsx';
import VoteForm from './vote-form.jsx';
import VoteFooter from './vote-footer.jsx';
import Map from './vote-map.jsx';

import ee from '../modules/event-emitter.js';
import urlParams from '../modules/params-handler.js';

class VoteFrame extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            artist_name: artist.name,
            artist_id: artist.id,

            voted: false,
            coords: {
                lat: 0,
                lng: 0
            }
        };
        this.changeAttributeValue = this.changeAttributeValue.bind(this)
    }

    componentDidMount() {
        let self = this;

        ee.on('isVoted', function(voted) {
            self.changeAttributeValue("voted", voted);
        });

        ee.on('changeCoords', function(coords){
            self.changeAttributeValue('coords', coords);
			localStorage.setItem('stagelink-coords', JSON.stringify(coords))
        })
    }

	componentWillMount(){
		let self = this;
		let stagelinkVote = JSON.parse(localStorage.getItem('stagelink-vote'))

		let stagelinkCoords = JSON.parse(localStorage.getItem('stagelink-coords'))

		if (stagelinkVote !== null && stagelinkVote.artist_id === artist.id) {
			self.changeAttributeValue('voted', true)
		}

		if (stagelinkCoords !== null) {
			self.changeAttributeValue('coords', stagelinkCoords)
		}

		// this params (code) is from instagramResponse → handle to change view to map
		if (urlParams['code'] !== undefined) {
			//to do
			// self.changeAttributeValue('voted', true)
			// requestToBackend with code from instagram and localStorage
		}
	}

    componentWillUnmount() {
        ee.unregister();
    }

    changeAttributeValue(param, value){
        var self = this;
        var obj = {};
        obj[param] = value;
        self.setState(obj);
    }

    render() {
        return (
            <div>
                {(this.state.voted === false)
                    ?
                    <div className="vote-box">
                        <VoteHeader artist_name={this.state.artist_name} />
                        <VoteForm changeAttributeValue={this.changeAttributeValue} />
                        <VoteFooter />
                    </div>

                    :
                    <Map
                        position={[this.state.coords.lat, this.state.coords.lng]}/>
                }
            </div>
        )
    }
}

export default VoteFrame;

ReactDOM.render(
    <VoteFrame />,
    document.querySelector('.container')
)
