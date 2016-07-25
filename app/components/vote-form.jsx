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
        <div className="wrapper">
            <div className="overlay-map">
                <div className="vote-frame">
                    <div className="fragment__vote-information">
                        <h2>Vote now!</h2>
                        <p>Request a show to access exclusive content and early bird tickets.</p>
                        <i className="icon-lock"></i>
                    </div>
                    <form>
                        <input name="authenticity_token"
                            value={this.state.authenticity_token}
                            type="hidden"/>
                        <input name="artist_id"
                            value={this.state.artist_id}
                            type="hidden"/>
                        <input name="referrer"
                            value={this.state.referrer}
                            type="hidden"/>

                        <div className="fragment__vote-details">
                            <h2>Please come to</h2>
                            <input className="input-field" placeholder="Type in your town" type="text" />

                            <h2>I'd pay up to</h2>
                            <div className="selects-wrapper">
                                <select className="select-input" name="price"></select>
                                <select className="select-input" name="currency"></select>
                            </div>
                        </div>
                        <div className="fragment__vote-buttons">
                            <div className="buttons-wrapper">
                                <button className={classNames('button', 'button__facebook')}>Request with Facebook</button>
                                <button className={classNames('button', 'button__gplus')}>Google</button>
                                <button className={classNames('button', 'button__instagram')}>Instagram</button>
                            </div>
                        </div>
                    </form>
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
