import React, {  PureComponent } from 'react';

class SessionCounter extends PureComponent {
    render(){
        return (
            <div>
                <h5> Your Pomo-Count </h5>
                {this.props.sessions}
            </div>
        )
    }
}

export default SessionCounter;