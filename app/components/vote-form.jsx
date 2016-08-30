import React from 'react';
import classNames from 'classnames';

import ee from '../modules/event-emitter.js';
import rq from '../modules/request-wrapper.js';

import facebookHandler from '../modules/facebook-handler.js';
import GoogleButton from '../modules/google-handler.jsx';
import InstagramButton from '../modules/instagram-handler.jsx';

import VoteHeader from './vote-header.jsx';

import DemandSelect from './demand-select.jsx';

class VoteForm extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            authResponse: {},

            artist_id: this.props.artist.id,
            address: '',

			inputValue: '',
			inputType: 'input',
			emptyField: false,
			selectedLocation: 0,
			locations: [],

			demand: {},

            referrer: document.referrer,
            request_url: window.location.href,
            submit: '',
            signup_variant: ''
        }

        this.facebookResponse = this.facebookResponse.bind(this)
		this.googleResponse = this.googleResponse.bind(this)
		this.storeStateBeforeRequest = this.storeStateBeforeRequest.bind(this)
		this.setNewValue = this.setNewValue.bind(this)
		this.handleEmptyInputField = this.handleEmptyInputField.bind(this)
		this.loadLocations = this.loadLocations.bind(this)
		this.selectPlaceById = this.selectPlaceById.bind(this)
		this.handleKeyEvents = this.handleKeyEvents.bind(this)
    }

    componentWillMount(){
        facebookHandler.loadSdk();
    }

    componentDidMount() {
		let self = this;
        facebookHandler.init();
		self.googleResponse();
    }

	componentDidUpdate(prevProps, prevState) {
		if (prevState.inputValue !== this.state.inputValue &&
			this.state.inputType === "input" || this.state.inputType === "") {
			this.loadLocations()
		}
	}

	componentWillUnmount() {
		ee.unregister();
	}

	storeStateBeforeRequest(){
		let data = this.state
		data.demand = this.refs.demand.getValue()
		localStorage.setItem('stagelink-vote', JSON.stringify(data))
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

	loadLocations(){
		let self = this;
		rq.getLocations(this.state.inputValue)
			.then((results) => {
				self.setState({
					'locations': results
				})
			})
			.catch((err) => {
				self.setState({
					'locations': []
				})
			})
	}

	setNewValue(event){
		if (event.target.value === "") {
			this.setState({
				emptyField: true,
				inputType: 'input',
				inputValue: event.target.value,
				address: event.target.value,
				selectedLocation: 0
			})
		} else {
			this.setState({
				emptyField: false,
				inputType: 'input',
				inputValue: event.target.value,
				address: event.target.value,
				selectedLocation: 0
			})
		}
	}

	handleEmptyInputField(){
		this.setState({
			emptyField: true
		})
	}

	selectPlaceById(location){
		if (location !== undefined) {
			rq.getCoordsById(location.place_id)

			this.setState({
				inputType: 'click',
				inputValue: location.city,
				address: location.city + ", " + location.country,
				locations: []
			})
		} else {
			rq.getCoordsByName(this.state.inputValue)
		}
	}

	handleKeyEvents(event){
		const items = this.state.locations.length - 1;
		const selectedLocation = this.state.selectedLocation;

		// select place by enter hit
		if (event.keyCode === 13) {
			this.selectPlaceById(this.state.locations[selectedLocation])
		}

		// change selectedLocation to up
		if (event.keyCode === 38 && selectedLocation > 0) {
			this.setState({
				selectedLocation: selectedLocation - 1
			})
		}

		// change selectedLocation to down
		if (event.keyCode === 40 && selectedLocation < items) {
			this.setState({
				selectedLocation: selectedLocation + 1
			})
		}
	}

	render () {
		return(
			<div className="wrapper" ref="form">
				<div className="overlay-map">
					<div className="vote-frame">

						<VoteHeader artist_name={this.props.artist.name} />

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
											onInput={this.setNewValue}
											onKeyDown={this.handleKeyEvents}/>
											<ul>
												{this.state.locations.map(function(location, i){
													return (
														<li
															key={location.place_id}
															value={i}
															className={this.state.selectedLocation === i ? 'active' : ''}
															onClick={this.selectPlaceById.bind(this, location)}>

															<strong>{location.city}</strong>
															{(location.country !== "")
																? ", "+location.country
																: ""
															}

														</li>
													)
												}.bind(this))}
											</ul>
									</div>
									:
									<div data-tooltip="Where should the show take place?">
										<input
											className="input-field input-field__error"
											placeholder="Type in your town"
											ref="address"
											type="text"
											value={this.state.inputValue}
											onInput={this.setNewValue} />
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

				</div>
			</div>
		)
	}
}

export default VoteForm;
