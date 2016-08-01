import EventEmitter from 'event-emitter';
import eeAllOff from 'event-emitter/all-off';

const Event = new (function() {

	const ee = new EventEmitter();
	this.on = ee.on.bind(ee);
	this.off = ee.off.bind(ee);
	this.once = ee.once.bind(ee);
	this.emit = ee.emit.bind(ee);
	this.unregister = () => {
		eeAllOff(ee);
	}
});

export default Event;
