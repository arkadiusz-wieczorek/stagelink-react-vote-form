
import React from 'react';
import InstagramLogin from 'react-instagram-login';
import classNames from 'classnames';
import ee from '../modules/event-emitter.js';


class InstagramButton extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
			clientId: '287f18930ef947a79a16c085372a7bb7'
		}
		this.responseInstagram = this.responseInstagram.bind(this)
    }
	responseInstagram(response){
		console.log('response', response);
		ee.emit('instagramResponse', response)
	}

	componentWillUnmount() {
		ee.emit('isVoted', true);
	}

	render(){
		return(
			<InstagramLogin
				clientId={this.state.clientId}
				buttonText={this.props.text}
				cssClass={classNames('button', 'button__instagram')}
				callback={this.responseInstagram}/>
		)
	}
}

export default InstagramButton
