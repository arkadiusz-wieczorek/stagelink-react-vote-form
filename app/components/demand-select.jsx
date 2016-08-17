import React from 'react';

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
	}

	componentDidMount() {
		this.loadCurrencies()

		if (this.state.needToUpdatePrices) {
			this.updatePrices(this.state.lastCurrency)
		}
	}

	componentDidUpdate() {
		if (this.state.needToUpdatePrices) {
			this.updatePrices(this.state.lastCurrency)
		}
	}

	loadCurrencies(){
		let formCurrencies = this.props.options;
		let currencies = [];

		for (let i in formCurrencies) {
			currencies.push(
				<option value={i} key={i}>
					{formCurrencies[i].currency_symbol}
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
		let choosenCurrencyPrices = this.props.options[currency].prices
		let prices = [];

		for (let i = 0; i < choosenCurrencyPrices.length; i++) {
			prices.push(
				<option	value={choosenCurrencyPrices[i]} key={i}>
					{choosenCurrencyPrices[i]}
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

export default DemandSelect;
