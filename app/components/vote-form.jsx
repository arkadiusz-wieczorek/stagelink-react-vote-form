import React from 'react';
import classNames from 'classnames';
import reqwest from 'reqwest';

import ee from '../modules/event-emitter.js';
import facebookHandler from '../modules/facebook-handler.js';
import googleHandler from '../modules/google-handler.js';
import InstagramButton from '../modules/instagram-handler.jsx';
import DemandSelect from './demand-select.jsx';

import urlParams from '../modules/params-handler.js';
import rq from '../modules/request-wrapper.js';

class VoteForm extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            authResponse: {},

            artist_id: this.props.artist_id,

            shadow_address: '',
            address: '',
            price: '',
            currency: '',

            referrer: document.referrer,
            request_url: window.location.href,
            submit: '',
            signup_variant: '',

			empty_fields: {
				address: true,
				price: true
			}
        }
        this.handleClick__facebook = this.handleClick__facebook.bind(this)
        this.handleClick__gplus = this.handleClick__gplus.bind(this)
		this.handleEmptyFields = this.handleEmptyFields.bind(this)
		this.beforeRequest = this.beforeRequest.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    componentWillMount(){
        facebookHandler.loadSdk();
        googleHandler.loadSdk();
    }
    componentDidMount() {
        facebookHandler.init();
    }

	componentWillUnmount() {
		localStorage.setItem('stagelink-vote', JSON.stringify(this.state))
	}

	beforeRequest(){
		localStorage.setItem('stagelink-vote', JSON.stringify(this.state))
		rq.getCoords(this.state.address)
	}


    handleClick__facebook() {
        let self = this;

        facebookHandler.login()
            .then((data) => {
                self.setState({
                    authResponse: data.response.authResponse,
                    submit: 'facebook',
                    signup_variant: 'facebook'
                })
				rq.sendVote(self.state)

                ee.emit('isVoted', data.logged);
            })
            .catch(function(err) {
                console.log('user_error', err);
            })
    }

    handleClick__gplus(){
		let self = this;

        googleHandler.init()
            .then(() => {
				googleHandler.login()
					.then((data) => {
						self.setState({
							authResponse: data.response,
							submit: 'google',
							signup_variant: 'google'
						})
						rq.sendVote(self.state)

						ee.emit('isVoted', data.logged)
					})
					.catch(function(err) {
						console.log('user_error', err);
					})
			})
    }

	handleEmptyFields(){
		console.log('empty fields')
	}

    handleChange(param){
        return function(event){
            let obj = {};
            obj[param] = event.target.value
            this.setState(obj);
        }.bind(this);
    }

    render () {
        return (
            <div className="wrapper">
                <div className="overlay-map">
                    <div className="vote-frame">
						<input name="authenticity_token"
							value={this.state.authenticity_token}
							type="hidden"/>
						<input name="artist_id"
							value={this.state.artist_id}
							type="hidden"/>
						<input name="referrer"
							value={this.state.referrer}
							type="hidden"/>

						<div className="fragment__vote-information">
							<h2>Vote now!</h2>
							<p>Request a show to access exclusive content and early bird tickets.</p>
							<i className="icon-lock">
								<p className="icon icon-lock-fill"></p>
							</i>
						</div>

						<div className="fragment__vote-details">
							<h2>Please come to</h2>
							<input className="input-field" placeholder="Type in your town" type="text" onChange={this.handleChange('address')}/>

							<h2>I'd pay up to</h2>
							<DemandSelect />
						</div>


                        <div className="fragment__vote-buttons">

								{(this.state.address !== '' && this.state.shadow_address !== '' && this.state.currency !== '' && this.state.price !== '')
									? <div className="buttons-wrapper" onClick={this.beforeRequest}>
											<button
												onClick={this.handleClick__facebook}
												className={classNames('button', 'button__facebook')}>
												<span className="icon icon-facebook"></span>
												Request with Facebook
											</button>
											<button
												onClick={this.handleClick__gplus}
												className={classNames('button', 'button__gplus')}>
												<span className="icon icon-google"></span>
												Google
											</button>
											<InstagramButton
												onClick={this.test}
												text="Instagram"/>
									</div>
									: <div className="buttons-wrapper">
											<button
												onClick={this.handleEmptyFields}
												className={classNames('button', 'button__facebook')}>
												<span className="icon icon-facebook"></span>
												Request with Facebook
											</button>
											<button
												onClick={this.handleEmptyFields}
												className={classNames('button', 'button__gplus')}>
												<span className="icon icon-google"></span>
												Google
											</button>
											<button
												onClick={this.handleEmptyFields}
												className={classNames('button', 'button__instagram')}>
												<span className="icon icon-instagram"></span>
												Instagram
											</button>
									</div>
								}
                        </div>

                    </div>
                    <div className="fragment__vote-about">
                        <p>
                            Your vote does not commit you to buy a ticket
                        </p>
                    </div>
                </div>
            </div>
        )
    }
}

export default VoteForm
