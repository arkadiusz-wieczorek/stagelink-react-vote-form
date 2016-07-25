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

class VoteFrame extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            artist_name: "Die Lochis",
            artist_id: "die-lochis",

            voted: false,
            lat: 52.51733,
            lng: 13.38886
        };
        this.changeAttributeValue = this.changeAttributeValue.bind(this)
    }

    componentDidMount() {
        var self = this;

		ee.on('isVoted', function(voted) {
			self.changeAttributeValue("voted", voted);
        });

        ee.on('changeCoords', function(coords){
            console.log('coooooords', coords);

            self.changeAttributeValue("lat", coords.lat);
            self.changeAttributeValue("lng", coords.lng);

            console.log('this.state', self.state);
        })
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
                        <VoteForm />
                        <VoteFooter />
                    </div>

                    :
                    <Map
                        position={[this.state.lat, this.state.lng]}/>
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
