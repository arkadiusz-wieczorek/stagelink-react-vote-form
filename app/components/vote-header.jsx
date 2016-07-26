import React from 'react';
import classNames from 'classnames';

class VoteHeader extends React.Component{
    constructor(props){
        super(props)
    }

    render () {
        return (
            <header>
                <h1>{this.props.artist_name}, come to my town!</h1>
            </header>
        )
    }
}

export default VoteHeader
