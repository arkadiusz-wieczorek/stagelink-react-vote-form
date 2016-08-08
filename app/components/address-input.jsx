import React from 'react';
import ee from '../modules/event-emitter.js';

class AddressInput extends React.Component{
    constructor(props){
        super(props)
        this.state = {
			inputValue: "",
			emptyField: this.props.emptyField,
			emitChange: false
		}
		this.handleChange = this.handleChange.bind(this)
	}

	componentDidMount() {

	}

	componentDidUpdate(nextProps, nextState) {
		if (this.state.inputValue.length > 0 && this.state.emitChange === true ) {
			console.log('cdu')
			// false for emptyfields by emit
			this.setState({
				emitChange: false
			})
			ee.emit('re-renderButtons', true)
		}
	}

	searchAddress(){
	}

	getValue(){
		let address = this.state.inputValue
		return address
	}

	handleChange(event){
		console.log('value input', event.target.value)
		if (this.state.emitChange === false) {
			this.setState({
				emitChange: true
			})
		}
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
