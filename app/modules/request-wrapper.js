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
			autocomplete.place({input: address, types: ['(cities)']}, function(err, results){
				if (results !== undefined) {
					let locations = []

					for (let i = 0; i < results.length; i++) {
						//  delete place which hasn't place_id
						if (results[i].place_id === undefined) {
							continue;
						} else {
							locations.push({
								city: results[i].terms.slice(-2)[0].value,
								country: results[i].terms.slice(-2)[1].value,
								place_id: results[i].place_id
							})
						}
					}
					resolve(locations)
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
			ee.emit('changeCoords', {
				lat: place.geometry.location.lat(),
				lng: place.geometry.location.lng()
			})
		})
	}
});

export default ReqwestWrapper;
