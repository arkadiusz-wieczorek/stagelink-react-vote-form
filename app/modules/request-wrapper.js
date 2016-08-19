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

	this.getLocations = (address) => {
		if (address !== "") {
			autocomplete.query({input: address, geocode: true}, function (err, results) {
				console.log('results', results);
			})
		}
	}

	this.getCoordsById = (placeId) => {
		// places.details({placeId: placeId}, function (err, place){
		places.details({placeId: 'ChIJtwrh7NJEBEcR0b80A5gx6qQ'}, function (err, place){
			console.log(
				'place',
				place.geometry.location.lat(),
				place.geometry.location.lng()
			);
		})

	}

	//
	//
	// this.__getCoords = (address, callback) => {
	// 	// const url = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
	// 	// const url = 'https://maps.googleapis.com/maps/api/place/js/AutocompletionService.GetPredictionsJson?address='
	//
	// 	if (address !== "") {
	// 	// const url = 'https://maps.googleapis.com/maps/api/place/queryautocomplete/xml?'
	// 		// const url = 'https://maps.googleapis.com/maps/api/place/queryautocomplete/json?'
	// 		const key = 'key=AIzaSyCslEMZxFioSTU3bs2vD7esV6v31oeY8Z4';
	// 		let correctAddress = '&input='+address.split(' ').join('+');
	// // https://maps.googleapis.com/maps/api/place/js/AutocompletionService.GetPredictionsJson?1shg&4sen&9s(cities)&15e3&key=AIzaSyCslEMZxFioSTU3bs2vD7esV6v31oeY8Z4&callback=_xdc_._atq8xd&token=18913
	// 		reqwest({
	// 			url: url+key+correctAddress,
	// 			method: 'get',
	// 			crossOrigin: true,
	// 			success: function(response){
	// 				console.log('test');
	// 				// console.log('response', response);
	// 				// if (response.status === "OK") {
	// 				// 	// ee.emit("changeCoords", response.results[0].geometry.location)
	// 				// 	ee.emit('locations', response.results)
	// 				// }
	// 				console.log('response', response);
	// 				// let locations = [];
	// 				//
	// 				// for (var i = 0; i < response.results.length; i++) {
	// 				// 	let obj = {
	// 				// 		name: response.results[i]['formatted_address'],
	// 				// 		coords: response.results[i]['formatted_address']['location']
	// 				// 	}
	// 				// 	console.log('obj.name', obj.name);
	// 				// 	locations.push(obj)
	// 				// }
	// 				// callback(locations)
	// 				// callback(res)
	// 			// }.bind(this)
	// 			},
	// 			complete: function(response){
	// 				console.log('response', response.content);
	// 			}
	// 		})
	// 	}
	// }
});

export default ReqwestWrapper;
