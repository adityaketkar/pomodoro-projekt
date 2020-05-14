import React, {  PureComponent } from 'react';
import './ControlPanel.css';


function Button(props) {
    const label = props.label;
  
    return (
      <button className="Button" onClick={props.onClick}>
        {label}
      </button>
    );
}

function Time(props) {
    const minutes = Math.floor(props.time / 60);
    const seconds = leftPad(props.time % 60);
  
    return (
      <span >
        {minutes}:{seconds}
      </span>
    );
}

function leftPad(number) {
    if (number < 10) {
      return `0${number}`;
    }
    return String(number);
}

class ControlPanel extends PureComponent {
    render(){
        return (
            <div >
            <h4>
              Timer Controls
            </h4>
            <Button
              label="-"
              onClick={this.props.onClickDecrease}
            />
            <span>
              <Time time={this.props.setTime} />
            </span>
            <Button
              label="+"
              onClick={this.props.onClickIncrease}
            />
          </div>
        )
    }
}

export default ControlPanel;