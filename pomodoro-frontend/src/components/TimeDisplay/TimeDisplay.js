import React from 'react';
import './TimeDisplay.css';

function pad2(num) {
  return num > 9 ? num : `0${num}`;
}

function formatTime(time) {
  const minutes = pad2(Math.floor(time / 60));
  const seconds = pad2(Math.floor(time % 60));

  return `${minutes}:${seconds}`;
}

const TimeDisplay = (props) => {
  document.title = `(${props.progress}%  ${formatTime(props.time)}) Pomodoro`;

  return (
    <div className="TimeDisplay" >
      <div>
        <button onClick={props.clicked}><h1>{formatTime(props.time)}</h1></button>
        <p>{props.status}</p>
      </div>
    </div>
  );
};

export default TimeDisplay;
