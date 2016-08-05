import reqwest from 'reqwest'
import ee from './event-emitter.js';

const ReqwestWrapper = new (function() {
	this.sendVote = (data) => {
		let url = 'http://localhost:3000/demands'
		console.log('request', data)
		reqwest({
			url: url,
			method: 'post',
			crossOrigin: true,
			data: data,
			success: function (response) {
				console.log(response)
			}
		})
	}

	this.getCoords = (address) => {
		const url = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
		const key = 'AIzaSyCslEMZxFioSTU3bs2vD7esV6v31oeY8Z4';
		let correctAddress = address.split(' ').join('+');

		reqwest({
			url: url+correctAddress,
			method: 'get',
			crossOrigin: true,
			success: function(response){
				console.log('response', response);
				if (response.status === "OK") {
					ee.emit("changeCoords", response.results[0].geometry.location)
				}
			}.bind(this)
		})
	}
});

export default ReqwestWrapper;
