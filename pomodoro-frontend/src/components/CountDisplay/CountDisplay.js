import React, {  PureComponent } from 'react';
import './CountDisplay.css';

class CountDisplay extends PureComponent {
    render(){
        return (
            <div className="Padded">
                <h5> {this.props.displayMessage} </h5>
                {this.props.count}
            </div>
        )
    }
}

export default CountDisplay;