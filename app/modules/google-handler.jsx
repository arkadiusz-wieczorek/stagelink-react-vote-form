import React from 'react';
import GoogleLogin from 'react-google-login';
import classNames from 'classnames';
import ee from '../modules/event-emitter.js';

class GoogleButton extends React.Component{

	constructor(props) {
		super(props)
		this.state = {
			clientId: '449144847900-bs5snfnipj05suk3djrjcge5o5atrnr5.apps.googleusercontent.com'
		}
		this.responseGoogle = this.responseGoogle.bind(this)
	}

	responseGoogle(googleUser) {
		// id_token
		let response = googleUser.getAuthResponse();
		console.log({accessToken: response});
		let data = {
			response: response,
			logged: true
		}
		ee.emit('googleResponse', data)
	}

	render () {
		return (
				<GoogleLogin
					clientId={this.state.clientId}
					cssClass={classNames('button', 'button__gplus')}
					callback={this.responseGoogle}>
					<span className="icon icon-google"></span>
					{this.props.text}
				</GoogleLogin>
		);
	}
}

export default GoogleButton;
