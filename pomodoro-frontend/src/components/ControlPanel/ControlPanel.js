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
    if(props.view=='false'){
      return (
        <span >
          {props.time}
        </span>
      );
    }
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
              {this.props.displayMessage}
            </h4>
            <Button
              label="-"
              onClick={this.props.onClickDecrease}
            />
            <span>
              <Time view={this.props.timeView} time={this.props.setTime} />
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