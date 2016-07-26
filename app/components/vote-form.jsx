import React from 'react';
import classNames from 'classnames';
import reqwest from 'reqwest';
import merge from 'merge-object';

import ee from '../modules/event-emitter.js';

class VoteForm extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            authResponse: {},

            authenticity_token: "",
            artist_id: 'die-lochis',
            referrer: '',

            shadow_address: 'Berlingen',
            address: "Berlin, Germany",
            price: '30',
            currency: 'GBP',

            submit: 'facebook',
            signup_variant: 'facebook'
        }
        this.checkConnectionWithMe = this.checkConnectionWithMe.bind(this)
        this.handleClick__facebook = this.handleClick__facebook.bind(this)
        this.handleClick__gplus = this.handleClick__gplus.bind(this)
        this.handleClick__instagram = this.handleClick__instagram.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    // it would be in mixins
    componentWillMount(){
        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = 'http://connect.facebook.net/en_US/sdk.js';
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }
    componentDidMount() {
        window.fbAsyncInit = function() {
            FB.init({
                appId      : '141443656045564', // need to change for state
                cookie     : true,
                xfbml      : true,
                version    : 'v2.0'
            });
        }.bind(this);
    }

    // facebook functions
    checkConnectionWithMe() {
        FB.api('/me', response => console.log(response));
    }

    statusChangeCallback(response) {
        console.log(response)
        this.setState({
            authResponse: response.authResponse
        })

        ee.emit('isVoted', true);

        // ----------
        // setState for voted in positive callback
        // TO DO An active access token must be used to query information about the current user.

        if (response.status === 'connected' || response.status === "unknown") {
            this.sendRequestToAPI();
        } else if (response.status === 'not_authorized') {
            console.log('not_authorized', response.status)
        } else {
            console.log('please log into fb')
        }
    }
    checkLoginState() {
        FB.getLoginStatus(function(response) {
            this.statusChangeCallback(response);
        }.bind(this));
    }

    requestAboutAddress(){
        const url = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
        const key = 'AIzaSyCslEMZxFioSTU3bs2vD7esV6v31oeY8Z4';
        var correctAddress = this.state.address.split(' ').join('+');

        reqwest({
            url: url+correctAddress,
            method: 'get',
            crossOrigin: true,
            success: function(response){
                if (response.status == "OK") {
                    console.log(response.results[0].geometry.location)
                    ee.emit("changeCoords", response.results[0].geometry.location)
                }
            }.bind(this)
        })
    }



    handleClick__facebook() {
        this.requestAboutAddress()
        FB.login(function(){this.checkLoginState()}.bind(this));
    }

    handleClick__gplus(){
        console.log('hello Google+');
    }

    handleClick__instagram(){
        console.log('hello Instagram');
    }


    handleChange(param){
        return function(event){
            var obj = {};
            obj[param] = event.target.value
            this.setState(obj);
        }.bind(this);
    }


    collectData(){
        var facebookResponse = this.state.authResponse;

        var fakeVoteFrameData = {
            'artist_id': 'die-lochis',
            'referrer': '',
            'shadow_address': 'Berlingen',
            'address': this.state.address,
            'price': '30',
            'currency': 'GBP',
            'submit': 'facebook',
            'signup_variant': 'facebook'
        }

        return merge(facebookResponse, fakeVoteFrameData)
    }

    sendRequestToAPI(){
        var url = 'http://localhost:3000/demands'

        reqwest({
            url: url,
            method: 'post',
            crossOrigin: true,
            data: this.collectData(),
            success: function (response) {
                console.log(response)
            }
        })
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

                        <div className="fragment__vote-buttons">
                            <div className="buttons-wrapper">
                                <button
                                    onClick={this.handleClick__facebook}
                                    className={classNames('button', 'button__facebook')}>
                                    Request with Facebook
                                </button>
                                <button
                                    className={classNames('button', 'button__gplus')}>
                                    Google
                                </button>
                                <button
                                    className={classNames('button', 'button__instagram')}>
                                    Instagram
                                </button>
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
