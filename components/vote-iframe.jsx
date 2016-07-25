import React from 'react';
import ReactDOM from 'react-dom';
import reqwest from 'reqwest';
import merge from 'merge-object';
import Lmap from './lmap.jsx';
import VoteForm from './form.jsx';
import classNames from 'classnames';

class VoteFrame extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            appId: '141443656045564',
            authResponse: {},
            voteFormData: {},
            voted: false,
            address: "Berlin, Germany",
            lng: 52.51733,
            lat: 13.38886,
            zoom: 16
        };
        this.handleClick = this.handleClick.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.collectData = this.collectData.bind(this)
        this.requestAboutAddress = this.requestAboutAddress.bind(this)
        this.unvote = this.unvote.bind(this)
        this.checkConnectionWithMe = this.checkConnectionWithMe.bind(this)
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
            authResponse: response.authResponse,
            voted: true
        })

        // ----------
        // setState for voted in positive callback
        // TO DO An active access token must be used to query information about the current user.

        if (response.status === 'connected' || response.status === "unknown") {
            this.sendRequestToAPI();
            // this.checkConnectionWithMe();
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
    handleClick() {
        FB.login(function(){this.checkLoginState()}.bind(this));
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

    handleChange(param){
        return function(event){
            var obj = {};
            obj[param] = event.target.value
            this.setState(obj);
        }.bind(this);
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

                    this.setState({
                        lat: response.results[0].geometry.location.lat,
                        lng: response.results[0].geometry.location.lng
                    })
                }
            }.bind(this)
        })
    }

    unvote(){
        this.setState({
            voted: false
        })
    }

    render() {
        return (
            <div>
                {(this.state.voted === false)
                    ?
                    <div>
                        <button onClick={this.requestAboutAddress}>set address from request to googleapis</button>
                        <input
                            type="text"
                            value={this.state.address}
                            onChange={this.handleChange('address')}/>
                        <button onClick={this.handleClick}>request to fb</button>
                    </div>

                    :
                    <div>
                        <button onClick={this.unvote}>Unvote</button>
                        <Lmap
                            position={[this.state.lat, this.state.lng]}
                            zoom={this.state.zoom}/>
                    </div>
                }
            </div>
        )
    }
}

export default VoteFrame;

ReactDOM.render(
    <VoteFrame />,
    document.querySelector('.vote-iframe')
)

// OK 1. send request from to login
//socialId: 141443656045564
// --------------------------------------------
// OK 2. receive answer from fb api (promises)
// ? 3. send request from code-form to backend
// 4. receive answer from backend
// 5. redirect?

// from fb (id and token)


//{"authenticity_token"=>"wKRPTzZ7cQR65hymGEpLAd3/HfY0Wp+Qu5yF8lI8Dh8=",
// "artist_id"=>"die-lochis",
// "referrer"=>"",
// "shadow_address"=>"Berlingen",
// "address"=>"Berlingen,
// Germany",
// "price"=>"30",
// "currency"=>"GBP",
// "submit"=>"facebook",
// "signup_variant"=>"facebook"}
