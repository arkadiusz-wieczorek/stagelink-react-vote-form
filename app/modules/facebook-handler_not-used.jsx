import React from 'react';
// import FacebookLogin from 'react-facebook-login';
import FacebookLogin from 'tim-react-facebook-login';
import classNames from 'classnames';
// import FacebookLogin from 'react-facebook-login-component';


import ee from '../modules/event-emitter.js';

class FacebookButton extends React.Component{

	constructor(props) {
		super(props)
		this.state = {
			appId: '141443656045564'
		}
	}

	responseFacebook(response) {
		console.log(response)
		let data = {
			response: response,
			submit: 'facebook',
			signup_variant: 'facebook',
			logged: true
		}
		ee.emit('response', data)
	}
	render(){
		return(
			<FacebookLogin
				appId={this.state.appId}
				scope="public_profile,email"
				size="small"
				callback={this.responseFacebook}
				autoLoad={false}
				textButton=""
				cssClass={classNames('button', 'button__facebook')}
				version="2.5"
				textButton={this.props.text}>
				<p>sdsdadas</p>


			</FacebookLogin>
		)
	}

	// render () {
	// 	return (
	// 			<FacebookLogin
	// 				appId={this.state.appId}
	// 				cssClass={classNames('button', 'button__facebook')}
	// 				fields="name,email,picture"
	// 				callback={this.responseFacebook}>
	// 	);
	// }
}

export default FacebookButton;
