var EventEmitter = require('event-emitter');
var eeAllOff = require('event-emitter/all-off');

var Event = new function() {

	// events
	var ee = new EventEmitter();
	this.on = ee.on.bind(ee);
	this.off = ee.off.bind(ee);
	this.once = ee.once.bind(ee);
	this.emit = ee.emit.bind(ee);
	this.unregister = function(){
		eeAllOff(ee);
	}
	this.isVoted = function(voted) {
		ee.emit('voted', voted);
	};
}

module.exports = Event;
