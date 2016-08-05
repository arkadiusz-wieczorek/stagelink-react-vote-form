import React from 'react';

class DemandSelect extends React.Component{
    constructor(props){
        super(props)
        this.state = {}
		this.getPrice = this.getPrice.bind(this);
		this.getCurrency = this.getCurrency.bind(this);
    }

	updatePrices(){

	}

	getPrice(){
		let price = this.refs.price.value;
		console.log(price)
		return price;
	}

	getCurrency(){
		let currency = this.refs.currency.value;
		console.log(currency)
		return currency;
	}

    render () {
        return (
			<div className="selects-wrapper">
				<select
					className="select-input"
					name="price"
					onChange={this.getPrice}
					ref="price">
					<option>
						2
					</option>
					<option>
						6
					</option>
				</select>
				<select
					className="select-input"
					name="currency"
					ref="currency"
					onChange={this.getCurrency}>
					<option>
						2
					</option>
					<option>
						5
					</option>
				</select>
			</div>
        )
    }
}

export default DemandSelect
