import reqwest from 'reqwest'
import ee from './event-emitter.js';
import Autocomplete from 'google-places-browser/autocomplete';
import Places from 'google-places-browser/places';

const ReqwestWrapper = new (function() {
	const autocomplete = Autocomplete(window.google)
	const places = Places(window.google)

	this.sendVote = (data) => {
		const url = 'http://localhost:3000/demands'
		data.emptyInputField = undefined;
		data.locations = undefined;
		data.selectedLocation = undefined;

		console.log('data to send', data);

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
		autocomplete.place({input: address, types: ['(cities)']}, (err, results) => {
			if (results !== undefined) {
				let locations = [];
				for (let i = 0; i < results.length; i++) {
					locations.push({
						city: results[i].terms[0].value,
						country: (results[i].terms[1] !== undefined) ? results[i].terms[1].value : "",
						place_id: results[i].place_id
					})
				}
				resolve(locations)
			} else {
				reject([])
			}
		})
	})

	this.getCoordsById = (placeId) => {
		places.details({placeId}, (err, place) => {
			let countryCode = place.address_components.filter((item) => {
				if (item.short_name.length <= 3 && item.types.indexOf('country') !== -1) {
					return item
				}
			})

			ee.emit('changeCoords', {
				lat: place.geometry.location.lat(),
				lng: place.geometry.location.lng(),
			})

			ee.emit('countryCode', countryCode[0].short_name)
		})
	}

	this.getCoordsByName = (address) => {
		const url = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
		const key = 'AIzaSyB7BqVTVe7VYHcPMBi5LuIDhw6fFVQ3OzQ';
		let correctAddress = address.split(' ').join('+');

		reqwest({
			url: url+correctAddress,
			method: 'get',
			crossOrigin: true,
			success: function(response){
				if (response.status === "OK") {
					ee.emit("changeCoords", response.results[0].geometry.location)
				}
			}
		})
	}

});

export default ReqwestWrapper;