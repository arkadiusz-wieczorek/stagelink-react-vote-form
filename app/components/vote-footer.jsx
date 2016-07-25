import React from 'react';
import classNames from 'classnames';

class VoteHeader extends React.Component{
  constructor(props){
    super(props)
  }

  render () {
    return (
        <footer>
            <img alt="Stagelink - Your fan-powered tour promoter" src="https://stagelink.s3.amazonaws.com/assets/icons/icon-sq-23669a8978b893d57378701bf2903508.png" width="50" />
            <p>© Stagelink GmbH 2016 - Made with in Berlin & New York</p>
        </footer>
    )
  }
}

export default VoteHeader
