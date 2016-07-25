// import React, { PropTypes } from 'react'
import React from 'react';
import classNames from 'classnames';

class VoteForm extends React.Component{
  constructor(props){
    super(props)
    this.state = {
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


  

  // to do change state to props
  render () {
    return (
        <form id="new_demand" className="form-inline form-theme2">
            <input name="authenticity_token"
                value={this.state.authenticity_token}
                type="hidden"/>
            <input name="artist_id"
                value={this.state.artist_id}
                type="hidden"/>
            <input name="referrer"
                value={this.state.referrer}
                type="hidden"/>
        </form>
    )
  }
}

export default VoteForm
