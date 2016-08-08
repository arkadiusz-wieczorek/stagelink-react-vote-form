import React from 'react';

class AddressInput extends React.Component{
    constructor(props){
        super(props)
        this.state = {
			inputValue: "",
			emptyField: this.props.emptyField
		}
		this.handleChange = this.handleChange.bind(this)
	}

	componentDidMount() {

	}

	searchAddress(){
	}

	getValue(){
		let address = this.state.inputValue
		return address
	}

	handleChange(event){
		console.log('value input', event.target.value)
		this.setState({
			inputValue: event.target.value
		})
	}


    render () {
        return (
			<div>
				{(this.props.emptyField !== true)
					? <input
						className="input-field"
						placeholder="Type in your town"
						ref="address"
						type="text"
						value={this.state.inputValue}
						onChange={this.handleChange}/>
					: <div data-tooltip="Where should the show take place?">
						<input
						className="input-field input-field__error"
						type="text"
						ref="address"
						value={this.state.inputValue}
						placeholder="Type in your town"
						onChange={this.handleChange} />
					</div>
				}
			</div>
        )
    }
}

export default AddressInput
