import React from 'react';
import classNames from 'classnames';
import reqwest from 'reqwest';

import ee from '../modules/event-emitter.js';
//
// import facebookHandler from '../modules/facebook-handler.js';
// import InstagramButton from '../modules/instagram-handler.jsx';
// import GoogleButton from '../modules/google-handler.jsx';

// import AddressInput from './address-input.jsx';
import DemandSelect from './demand-select.jsx';

import urlParams from '../modules/params-handler.js';
import rq from '../modules/request-wrapper.js';

class VoteForm extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            authResponse: {},

            artist_id: this.props.artist.id,

            shadow_address: '',
            address: '',
			inputValue: '',

			demand: {},

            referrer: document.referrer,
            request_url: window.location.href,
            submit: '',
            signup_variant: '',

			emptyField: false

        }
        this.facebookResponse = this.facebookResponse.bind(this)
		this.googleResponse = this.googleResponse.bind(this)
		this.handleEmptyFields = this.handleEmptyFields.bind(this)
		this.storeStateBeforeRequest = this.storeStateBeforeRequest.bind(this)
        this.handleChange = this.handleChange.bind(this)
		this.hasValue = this.hasValue.bind(this)
		this.setNewValue = this.setNewValue.bind(this)
    }

    componentWillMount(){
        // facebookHandler.loadSdk();
    }
    componentDidMount() {
        // facebookHandler.init();
		let self = this;

		self.googleResponse();

		ee.on('re-renderButtons', function(data){
			console.log('re-renderButtons', data)
			self.setState({
				emptyField: data
			})
		})
    }

	componentDidUpdate	(prevProps, prevState) {
		console.log('this.state', this.state)
		console.log('prevState', prevState)

		// to do
		if (this.state.emptyField !== prevState.emptyField) {
			this.refs.address.focus()
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
		rq.getCoords(this.state.address)
	}

	googleResponse(){
		let self = this;

		// ee.on('googleResponse', function(data){
		// 	self.setState({
		// 		authResponse: data,
		// 		submit: 'google',
		// 		signup_variant: 'google'
		// 	})
		// 	rq.sendVote(self.state)
		//
		// 	ee.emit('isVoted', data.logged)
		// })
	}

    facebookResponse() {
        let self = this;

        // facebookHandler.login()
        //     .then((data) => {
        //         self.setState({
        //             authResponse: data.response.authResponse,
        //             submit: 'facebook',
        //             signup_variant: 'facebook'
        //         })
		// 		rq.sendVote(self.state)
		//
        //         ee.emit('isVoted', data.logged);
        //     })
        //     .catch(function(err) {
        //         console.log('user_error', err);
        //     })
    }


	handleEmptyFields(){
		console.log('empty fields')
		console.log(this.refs.demand.getValue())

		let address = this.refs.address.value;

		if (address === '') {
			this.setState({
				emptyField: true
			})
		} else {
			this.setState({
				emptyField: false,
			})
		}
	}

	hasValue(){
		console.log('works')
	}

    handleChange(param){
        return function(event){
            let obj = {};
            obj[param] = event.target.value
            this.setState(obj);
        }.bind(this);
    }

	setNewValue(event){
		console.log('ekhmm new value')
		this.setState({
			emptyField: false,
			address: event.target.value,
			shadow_address: event.target.value,
			inputValue: event.target.value
		})
	}

    render () {
        return (
            <div className="wrapper" ref="form">
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
								<div>
									{(this.state.emptyField !== true)
										? <input
											className="input-field"
											placeholder="Type in your town"
											ref="address"
											type="text"
											value={this.state.inputValue}
											onChange={this.setNewValue}/>
										: <div data-tooltip="Where should the show take place?">
											<input
											className="input-field input-field__error"
											type="text"
											ref="address"
											value={this.state.inputValue}
											placeholder="Type in your town"
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
									? <div className="buttons-wrapper" onClick={this.storeStateBeforeRequest}>
											<button
												onClick={this.hasValue}
												className={classNames('button', 'button__facebook')}>
												<span className="icon icon-facebook"></span>
												Request with Facebook
											</button>
											<button
												onClick={this.hasValue}
												className={classNames('button', 'button__gplus')}>
												<span className="icon icon-google"></span>
												Google
											</button>
											<button
												onClick={this.hasValue}
												className={classNames('button', 'button__instagram')}>
												<span className="icon icon-instagram"></span>
												Instagram
											</button>
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
