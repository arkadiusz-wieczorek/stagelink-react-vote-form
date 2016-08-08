import React from 'react';

class AddressInput extends React.Component{
    constructor(props){
        super(props)
        this.state = {}
	}

	componentDidMount() {

	}

	componentDidUpdate() {

	}

	searchAddress(){
		console.log('ssss')
	}


    render () {
        return (
			<input
				className="input-field"
				placeholder="Type in your town"
				type="text"
				onChange={this.searchAddress}/>
        )
    }
}

export default AddressInput
