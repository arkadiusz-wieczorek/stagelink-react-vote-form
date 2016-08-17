import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import VoteHeader from './vote-header.jsx';
import VoteForm from './vote-form.jsx';
import VoteFooter from './vote-footer.jsx';
import Map from './vote-map.jsx';

import ee from '../modules/event-emitter.js';
import urlParams from '../modules/params-handler.js';
import rq from '../modules/request-wrapper.js';

class VoteFrame extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
    		artist: artist,

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

		// redirect to map view when artist-id in form it is identical with global artist-id
		if (stagelinkVote !== null && stagelinkVote.artist_id === artist.id) {
			self.changeAttributeValue('voted', true)
		}

		// handle coords when this component is mounting again
		if (stagelinkCoords !== null) {
			self.changeAttributeValue('coords', stagelinkCoords)
		}

		//handle response from instagram to send request to backend
		if (urlParams['code'] !== undefined && stagelinkVote !== null) {
			let instagramCode = urlParams['code']
			stagelinkVote.authResponse = instagramCode
			stagelinkVote.submit = 'instagram'
			stagelinkVote.signup_variant = 'instagram'
			rq.sendVote(stagelinkVote)
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
	                        <VoteHeader
								artist_name={this.state.artist.name}/>
	                        <VoteForm
								changeAttributeValue={this.changeAttributeValue}
								artist={this.state.artist} />
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
