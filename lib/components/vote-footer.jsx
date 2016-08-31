import React from 'react';

const VoteHeader = (props) => (
	<footer>
		<div className="fragment__vote-about">
			<p>
				Your vote does not commit you to buy a ticket
			</p>
		</div>
		<span className="icon icon-stagelink_icon" />
		<p>
			Made with <span className="icon icon-heart" /> in Berlin &amp; New York
		</p>
		<p>
			© Stagelink GmbH 2016
		</p>
	</footer>
)

export default VoteHeader;
