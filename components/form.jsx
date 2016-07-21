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
            <div className="steps-nav__select-city">
                <div className="steps-nav__info">
                    <p>Please come to</p>
                </div>
                <span className="twitter-typehead">
                    <input name="shadow_address"
                        id="shadow_address"
                        type="text"
                        className={classNames('input-field', 'city-autocomplete', 'tt-input')}
                        placeholder="Type in your town"/>
                    <span className="tt-dropdown-menu">
                        <div className="tt-dataset-google-places"></div>
                    </span>
                </span>
                <input name="address"
                    type="hidden"
                    value={this.state.address}/>
            </div>
            <div className="steps-nav__select-price">
                <div className="steps-nav__info">
                    <p>I'd pay up to</p>
                </div>
                <div className="demand-price-wrapper">
                    <p>TO DO select</p>
                </div>
            </div>
        </form>
    )
  }
}

export default VoteForm
