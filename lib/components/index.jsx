import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import VoteForm from './vote-form.jsx';
import Footer from './footer.jsx';
import Map from './map.jsx';

import ee from '../modules/event-emitter.js';
import urlParams from '../modules/params-handler.js';
import rq from '../modules/request-wrapper.js';

class VoteFrame extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
    		artist: artist,
            voted: false,
            coords: {}
        };
    }

    componentDidMount() {
        let self = this;

        ee.on('isVoted', function(voted) {
			self.setState({
				voted: voted
			})
        });

        ee.on('changeCoords', function(coords){
			self.setState({
				coords: coords
			})
			localStorage.setItem('stagelink-coords', JSON.stringify(coords))
        })
    }

	componentWillMount(){
		let stagelinkVote = JSON.parse(localStorage.getItem('stagelink-vote'))
		let stagelinkCoords = JSON.parse(localStorage.getItem('stagelink-coords'))

		// redirect to map view when artist-id in form it is identical with global artist-id
		if (stagelinkVote !== null && stagelinkVote.artist_id === artist.id) {
			this.setState({
				voted: true
			})
		}

		// handle coords when this component is mounting again
		if (stagelinkCoords !== null) {
			this.setState({
				coords: stagelinkCoords
			})
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

    render() {
        return (
            <div>
                {(this.state.voted === false)
                    ?
	                    <div className="vote-box">
	                        <VoteForm
								artist={this.state.artist} />
							<Footer />
	                    </div>
                    :
	                    <Map position={[this.state.coords.lat, this.state.coords.lng]}/>
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
