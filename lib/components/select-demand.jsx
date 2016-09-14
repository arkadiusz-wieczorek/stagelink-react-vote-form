import React from 'react';
import ee from '../modules/event-emitter.js';

export default class SelectDemand extends React.Component{
    constructor(props){
        super(props)
        this.state = {
			lastCurrency: Object.keys(this.props.voteValues)[0],
			updatePrices: true,
			prices: [],
			currencies: []
		}

		this.loadCurrencies = this.loadCurrencies.bind(this);
		this.handleChangeCurrency = this.handleChangeCurrency.bind(this);
		this.checkCurrencyForCountry = this.checkCurrencyForCountry.bind(this);
	}

	componentDidMount() {
		let self = this;
		self.loadCurrencies()

		if (self.state.updatePrices) self.updatePrices(self.state.lastCurrency)

		ee.on('countryCode', function(country_code) {
			let newCurrency = self.checkCurrencyForCountry(country_code)
			if (self.state.lastCurrency !== newCurrency) {

				self.setState({
					lastCurrency: newCurrency,
					updatePrices: true
				})
				self.refs.currency.value = newCurrency
			}
		})
	}

	componentDidUpdate() {
		if (this.state.updatePrices) this.updatePrices(this.state.lastCurrency)
	}

	componentWillUnmount() {
		ee.unregister()
	}

	checkCurrencyForCountry(country_code){
		let currency = 'USD';
		if (this.props.GBP.has(country_code)) currency = 'GBP'
		if (this.props.EUR.has(country_code)) currency = 'EUR'

		return currency
	}

	loadCurrencies(){
		let currencies = [];

		for (let i in this.props.voteValues) {
			currencies.push(
				<option value={i} key={i}>
					{this.props.voteValues[i].currency_symbol}
				</option>
			)
		}

		this.setState({
			currencies: currencies
		})
	}

	handleChangeCurrency(){
		if (this.state.lastCurrency !== this.refs.currency.value) {
			this.setState({
				lastCurrency: this.refs.currency.value,
				updatePrices: true
			})
		}
	}

	updatePrices(currency){
		let prices = [];

		for (let i = 0; i < this.props.voteValues[currency].prices.length; i++) {
			prices.push(
				<option	value={this.props.voteValues[currency].prices[i]} key={i}>
					{this.props.voteValues[currency].prices[i]}
				</option>
			);
		}

		this.setState({
			prices: prices,
			updatePrices: false
		})

		this.refs.price.selectedIndex = 0;
	}

	getValue(){
		let price = this.refs.price.value;
		let currency = this.refs.currency.value;
		return {price: price, currency: currency}
	}

    render () {
        return (
			<div className="selects-container">
				<label>
					<select
						className="select-input"
						name="price"
						ref="price">
							{this.state.prices}
					</select>
				</label>
				<label>
					<select
						className="select-input"
						name="currency"
						ref="currency"
						onChange={this.handleChangeCurrency}>
							{this.state.currencies}
					</select>
				</label>
			</div>
        )
    }
}

SelectDemand.defaultProps = {
	GBP: new Set(["GB", "GG", "GI", "IM", "JE"]),
	EUR: new Set(["AD", "AL", "AT", "BA", "BE", "BG", "BY", "CH", "CZ", "DE", "DK", "EE", "ES", "FI", "FI", "FO", "FR", "GF", "GP", "GR", "HR", "HU", "IE", "IS", "IT", "LI", "LT", "LU", "LV", "MC", "ME", "MK", "MQ", "MT", "NL", "NO", "PL", "PM", "PT", "RO", "RS", "RU", "SE", "SI", "SJ", "SK", "SM", "TF", "UA"])
}
