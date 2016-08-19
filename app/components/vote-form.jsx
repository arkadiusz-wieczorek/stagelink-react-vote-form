import React from 'react';
import classNames from 'classnames';

import ee from '../modules/event-emitter.js';
import rq from '../modules/request-wrapper.js';

import facebookHandler from '../modules/facebook-handler.js';
import GoogleButton from '../modules/google-handler.jsx';
import InstagramButton from '../modules/instagram-handler.jsx';

import DemandSelect from './demand-select.jsx';


// import Autocomplete from 'react-autocomplete';
// import Autocomplete from 'react-google-autocomplete';



class VoteForm extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            authResponse: {},

            artist_id: this.props.artist.id,

            shadow_address: '',
            address: '',

			inputValue: '',
			value: '',
			loading: false,
			emptyField: false,

			demand: {},

            referrer: document.referrer,
            request_url: window.location.href,
            submit: '',
            signup_variant: '',

			locations: []
        }

        this.facebookResponse = this.facebookResponse.bind(this)
		this.googleResponse = this.googleResponse.bind(this)
		this.storeStateBeforeRequest = this.storeStateBeforeRequest.bind(this)
		this.setNewValue = this.setNewValue.bind(this)
		this.handleEmptyInputField = this.handleEmptyInputField.bind(this)
		this.loadLocations = this.loadLocations.bind(this)
    }

    componentWillMount(){
        facebookHandler.loadSdk();
    }

    componentDidMount() {
        facebookHandler.init();
		let self = this;
		self.googleResponse();
		self.loadLocations();
    }

	loadLocations(){
		ee.on('locations', function(data){
			console.log('data', data);
		})
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.inputValue !== this.state.inputValue) {
			rq.getLocations(this.state.address)
		}
	}

	componentWillUnmount() {
		this.setState({
			demand: this.refs.demand.getValue()
		})
		localStorage.setItem('stagelink-vote', JSON.stringify(this.state))
	}

	storeStateBeforeRequest(){
		this.setState({
			demand: this.refs.demand.getValue()
		})
		localStorage.setItem('stagelink-vote', JSON.stringify(this.state))
		rq.getLocations(this.state.address)
	}

	googleResponse(){
		let self = this;

		ee.on('googleResponse', function(data){
			self.setState({
				authResponse: data,
				submit: 'google',
				signup_variant: 'google'
			})
			rq.sendVote(self.state)

			ee.emit('isVoted', data.logged)
		})
	}

    facebookResponse() {
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

	setNewValue(event){
		if (event.target.value === "") {
			this.setState({
				emptyField: true,
				address: event.target.value,
				shadow_address: event.target.value,
				inputValue: event.target.value
			})
		} else {
			this.setState({
				emptyField: false,
				address: event.target.value,
				shadow_address: event.target.value,
				inputValue: event.target.value
			})
		}
	}

	handleEmptyInputField(){
		console.log('no value');
		this.setState({
			emptyField: true
		})
	}

	// TO DO it's uunnecessary from inputs

	// <input
	// 	name="authenticity_token"
	// 	value={this.state.authenticity_token}
	// 	type="hidden"/>
	// <input
	// 	name="artist_id"
	// 	value={this.state.artist_id}
	// 	type="hidden"/>
	// <input
	// 	name="referrer"
	// 	value={this.state.referrer}
	// 	type="hidden"/>

	render () {
		return (
			<div className="wrapper" ref="form">
				<div className="overlay-map">
					<div className="vote-frame">

						<div className="fragment__vote-information">
							<h2>Vote now!</h2>
							<p>Request a show to access exclusive content and early bird tickets.</p>
							<i className="icon-lock">
								<p className="icon icon-lock-fill"></p>
							</i>
						</div>

						<div className="fragment__vote-details">
							<h2>Please come to</h2>

							<div>
								{(this.state.emptyField === false)
									?
									<div>
										<input
											className="input-field"
											placeholder="Type in your town"
											ref="address"
											type="text"
											value={this.state.inputValue}
											onChange={this.setNewValue}/>
									</div>
									:
									<div data-tooltip="Where should the show take place?">
										<input
											className="input-field input-field__error"
											placeholder="Type in your town"
											ref="address"
											type="text"
											value={this.state.inputValue}
											onChange={this.setNewValue} />
									</div>
								}
							</div>

							<h2>I'd pay up to</h2>
							<DemandSelect
								options={this.props.artist['vote-values']}
								ref="demand"/>
						</div>

						<div className="fragment__vote-buttons">

							{(this.state.inputValue !== "")

								?
								<div className="buttons-wrapper" onClick={this.storeStateBeforeRequest}>
									<button
										onClick={this.facebookResponse}
										className={classNames('button', 'button__facebook')}>
										<span className="icon icon-facebook"></span>
										Request with Facebook
									</button>
									<GoogleButton
										text="Google"/>
									<InstagramButton
										text="Instagram"/>
								</div>
								:
								<div className="buttons-wrapper">
									<button
										onClick={this.handleEmptyInputField}
										className={classNames('button', 'button__facebook')}>
										<span className="icon icon-facebook"></span>
										Request with Facebook
									</button>
									<button
										onClick={this.handleEmptyInputField}
										className={classNames('button', 'button__gplus')}>
										<span className="icon icon-google"></span>
										Google
									</button>
									<button
										onClick={this.handleEmptyInputField}
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

export default VoteForm;

//
// <Autocomplete
// 	className="input-field"
// 	inputProps={{className: 'input-field'}}
// 	ref="autocomplete"
// 	value={this.state.inputValue}
// 	items={this.state.locations}
// 	getItemValue={(item) => item.name}
// 	onSelect={(value, item) => {
// 		this.setState({
// 			inputValue: value,
// 			locations: [ item ]
// 		})
// 	}}
// 	onChange={(event, value) => {
//
// 		var self = this;
// 		self.setState({
// 			inputValue: value,
// 			loading: true
// 		})
//
// 		if (value !== "") {
//
// 			rq.getLocations(value, function(data){
// 				self.setState({
// 					locations: data,
// 					inputValue: value,
// 					loading: false
// 				})
// 			})
// 		}
// 	}}
// 	renderItem={(item, isHighlighted) => (
// 		<div key={item.abbr} id={item.abbr}>
// 			{item.name}
// 		</div>
// 	)}
// 	/>
