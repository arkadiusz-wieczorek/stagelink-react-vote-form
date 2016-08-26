import React from 'react';
import ee from '../modules/event-emitter.js';

class DemandSelect extends React.Component{
    constructor(props){
        super(props)
        this.state = {
			lastCurrency: Object.keys(this.props.options)[0],
			needToUpdatePrices: true,
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

		if (self.state.needToUpdatePrices) self.updatePrices(self.state.lastCurrency)

		ee.on('countryCode', function(country_code) {
			let newCurrency = self.checkCurrencyForCountry(country_code)
			if (self.state.lastCurrency !== newCurrency) {

				self.setState({
					lastCurrency: newCurrency,
					needToUpdatePrices: true
				})
				self.refs.currency.value = newCurrency
			}
		})
	}

	componentDidUpdate() {
		if (this.state.needToUpdatePrices) this.updatePrices(this.state.lastCurrency)
	}

	checkCurrencyForCountry(country_code){
		let currency = 'USD';
		if (this.props.GBP.has(country_code)) currency = 'GBP'
		if (this.props.EUR.has(country_code)) currency = 'EUR'

		return currency
	}

	loadCurrencies(){
		let currencies = [];

		for (let i in this.props.options) {
			currencies.push(
				<option value={i} key={i}>
					{this.props.options[i].currency_symbol}
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
				needToUpdatePrices: true
			})
		}
	}

	updatePrices(currency){
		let prices = [];

		for (let i = 0; i < this.props.options[currency].prices.length; i++) {
			prices.push(
				<option	value={this.props.options[currency].prices[i]} key={i}>
					{this.props.options[currency].prices[i]}
				</option>
			);
		}

		this.setState({
			prices: prices,
			needToUpdatePrices: false
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
			<div className="selects-wrapper">
				<select
					className="select-input"
					name="price"
					ref="price">
						{this.state.prices}
				</select>
				<select
					className="select-input"
					name="currency"
					ref="currency"
					onChange={this.handleChangeCurrency}>
						{this.state.currencies}
				</select>
			</div>
        )
    }
}

DemandSelect.defaultProps = {
	GBP: new Set(["GB", "GG", "GI", "IM", "JE"]),
	EUR: new Set(["AD", "AL", "AT", "BA", "BE", "BG", "BY", "CH", "CZ", "DE", "DK", "EE", "ES", "FI", "FI", "FO", "FR", "GF", "GP", "GR", "HR", "HU", "IE", "IS", "IT", "LI", "LT", "LU", "LV", "MC", "ME", "MK", "MQ", "MT", "NL", "NO", "PL", "PM", "PT", "RO", "RS", "RU", "SE", "SI", "SJ", "SK", "SM", "TF", "UA"])
}

export default DemandSelect;
