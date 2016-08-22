import reqwest from 'reqwest'
import ee from './event-emitter.js';


import Autocomplete from 'google-places-browser/autocomplete';
import Places from 'google-places-browser/places';

const ReqwestWrapper = new (function() {
	const autocomplete = Autocomplete(window.google)
	const places = Places(window.google)

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

	this.getLocations = (address) => new Promise((resolve, reject) => {
		if (address !== "") {
			autocomplete.query({input: address, geocode: true}, function(err, results){
				if (results !== undefined) {
					resolve(results)
				} else {
					reject([])
				}
			})
		} else {
			reject([])
		}
	})

	this.getCoordsById = (placeId) => {
		places.details({placeId: placeId}, function (err, place){
		// places.details({placeId: 'ChIJtwrh7NJEBEcR0b80A5gx6qQ'}, function (err, place){
			console.log(
				'place',
				place.geometry.location.lat(),
				place.geometry.location.lng()
			);
		})

	}

});

export default ReqwestWrapper;
