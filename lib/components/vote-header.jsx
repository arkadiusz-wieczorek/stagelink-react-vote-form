import React from 'react';
const VoteHeader = (props) => (
	<div className="fragment__vote-information">
		<h1>{props.artist_name}</h1>
		<h2>Come to my town!</h2>
		<p>Request a show to access exclusive content and early bird tickets.</p>
		<i className="icon-lock">
			<p className="icon icon-lock-fill"></p>
		</i>
	</div>
)
export default VoteHeader;
