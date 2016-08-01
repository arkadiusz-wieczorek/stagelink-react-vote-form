import React from 'react';
import classNames from 'classnames';
import reqwest from 'reqwest';
import merge from 'merge-object';

import ee from '../modules/event-emitter.js';
import facebookHandler from '../modules/facebook-handler.js';
import googleHandler from '../modules/google-handler.js';
import InstagramButton from '../modules/instagram-handler.jsx';

import urlParams from '../modules/params-handler.js';

class VoteForm extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            authResponse: {},

            artist_id: 'die-lochis',

            shadow_address: '',
            address: "",
            price: '',
            currency: '',

            referrer: document.referrer,
            request_url: window.location.href,
            submit: 'instagram',
            signup_variant: 'instagram'
        }
        this.handleClick__facebook = this.handleClick__facebook.bind(this)
        this.handleClick__gplus = this.handleClick__gplus.bind(this)
		this.beforeRequest = this.beforeRequest.bind(this)
        this.handleChange = this.handleChange.bind(this)
		this.requestAboutAddress = this.requestAboutAddress.bind(this)
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
		this.requestAboutAddress()

	}

    requestAboutAddress(){
        const url = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
        const key = 'AIzaSyCslEMZxFioSTU3bs2vD7esV6v31oeY8Z4';
        let correctAddress = this.state.address.split(' ').join('+');

        reqwest({
            url: url+correctAddress,
            method: 'get',
            crossOrigin: true,
            success: function(response){
                console.log('response', response);
                if (response.status === "OK") {
                    ee.emit("changeCoords", response.results[0].geometry.location)
                }
            }.bind(this)
        })
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
                console.log('self.state', self.state);
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
						console.log('self.state', self.state);
						ee.emit('isVoted', data.logged)
					})
					.catch(function(err) {
						console.log('user_error', err);
					})
			})
    }


    handleChange(param){
        return function(event){
            let obj = {};
            obj[param] = event.target.value
            this.setState(obj);
        }.bind(this);
    }

    // sendRequestToAPI(){
    //     let url = 'http://localhost:3000/demands'
	//
    //     reqwest({
    //         url: url,
    //         method: 'post',
    //         crossOrigin: true,
    //         data: this.state,
    //         success: function (response) {
    //             console.log(response)
    //         }
    //     })
    // }

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
							<i className="icon-lock"></i>
						</div>

						<div className="fragment__vote-details">
							<h2>Please come to</h2>
							<input className="input-field" placeholder="Type in your town" type="text" onChange={this.handleChange('address')}/>

							<h2>I'd pay up to</h2>
							<div className="selects-wrapper">
								<select className="select-input" name="price"></select>
								<select className="select-input" name="currency"></select>
							</div>
						</div>


                        <div className="fragment__vote-buttons" onClick={this.beforeRequest}>
                            <div className="buttons-wrapper">
                                <button
                                    onClick={this.handleClick__facebook}
                                    className={classNames('button', 'button__facebook')}>
                                    Request with Facebook
                                </button>
                                <button
                                    onClick={this.handleClick__gplus}
                                    className={classNames('button', 'button__gplus')}>
                                    Google
                                </button>

								<InstagramButton
									text="Instagram"/>
                            </div>
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
