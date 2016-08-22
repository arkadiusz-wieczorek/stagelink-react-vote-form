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
				let locations = []

				if (results !== undefined) {
					for (let i = 0; i < results.length; i++) {
						//  delete place which hasn't place_id
						if (results[i].place_id === undefined) {
							// results.splice(i, 1)
							continue;
						} else {
							// create nice name for place through term array
							let name = ""
							let values = results[i].terms.slice(-2);
							values.map(function(term){
								name += term.value+", "
							})
							let place_id = results[i].place_id

							locations.push({
								name: name.slice(0, -2),
								place_id: place_id
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
		// places.details({placeId: 'ChIJtwrh7NJEBEcR0b80A5gx6qQ'}, function (err, place){
			ee.emit('changeCoords', {
				lat: place.geometry.location.lat(),
				lng: place.geometry.location.lng()
			})
			console.log('emit');
		})

	}

});

export default ReqwestWrapper;
