import React from 'react';
import ReactDOM from 'react-dom';
import reqwest from 'reqwest';
import merge from 'merge-object';
import classNames from 'classnames';

import VoteHeader from './header.jsx';
import VoteForm from './form.jsx';
import Lmap from './lmap.jsx';

class VoteFrame extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            appId: '141443656045564',
            authResponse: {},
            voteFormData: {},

            artist_name: "Jo Stöckholzer",
            artist_id: "12345678",

            voted: false,
            address: "Berlin, Germany",
            lng: 52.51733,
            lat: 13.38886,
            zoom: 16
        };
        // this.handleClick = this.handleClick.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.collectData = this.collectData.bind(this)
        this.requestAboutAddress = this.requestAboutAddress.bind(this)
        this.unvote = this.unvote.bind(this)
        // this.checkConnectionWithMe = this.checkConnectionWithMe.bind(this)
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
                it works
                <twoway />
            </div>
        )
    }
}

export default VoteFrame;

ReactDOM.render(
    <VoteFrame />,
    document.querySelector('.container')
)
// <div>
//     {(this.state.voted === false)
//         ?
//         <div>
//             <button onClick={this.requestAboutAddress}>set address from request to googleapis</button>
//             <input
//                 type="text"
//                 value={this.state.address}
//                 onChange={this.handleChange('address')}/>
//             <button onClick={this.handleClick}>request to fb</button>
//         </div>
//
//         :
//         <div>
//             <button onClick={this.unvote}>Unvote</button>
//             <Lmap
//                 position={[this.state.lat, this.state.lng]}
//                 zoom={this.state.zoom}/>
//         </div>
//     }
// </div>

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
