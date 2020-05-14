import React, { Component } from 'react';
import TimeDisplay from '../components/TimeDisplay/TimeDisplay';
import './Pomodoro.css';
import ControlPanel from '../components/ControlPanel/ControlPanel';
import SessionCounter from '../components/SessionCounter/SessionCounter';
import Axios from 'axios';

class Pomodoro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      interval: false,
      time: 1500,
      setTime: 1500,
      running: false,
      taskStatus:
        JSON.parse(window.localStorage.getItem('pomodoro-react-taskStatus')) ||
        null
      ,
      completedSession : 0
    };
  }

  updateDatabase = () =>{
    console.log('postbhejs');
    const post = {
        completedSessions: this.state.completedSession,
        user: 'Aditya',
        date: (new Date()).toDateString()
    };
    Axios.post('https://pomodoro-projekt.firebaseio.com/posts.json', post)
    .then( response => {
        console.log(response);
    });
    
  }

  onClickIncrease = () => {
    const newSetTime = this.state.setTime + 60;
    const newState = {
      ...this.state,
      setTime : newSetTime,
      time: newSetTime
    }
    this.setState(newState);
  }

  onClickDecrease= () => {
    if(this.state.setTime<=100) return;
    const newSetTime = this.state.setTime - 60;
    const newState = {
      ...this.state,
      setTime : newSetTime,
      time: newSetTime
    }
    this.setState(newState);
  }

  tick = () => {
    if (this.state.time <= 1) {
      this.stopInterval();
      this.setState({ running: false });
      this.setState(state => ({ time: state.setTime }));
      return;
    }
    this.setState(state => ({ time: state.time - 1 }));
  };

  stopInterval = () => {
    clearInterval(this.state.interval);
    const newCompletedSession = this.state.completedSession +1;
    this.setState({ interval: null, completedSession: newCompletedSession });
    this.updateDatabase();
  };

  startTimer = () => {
    this.setState(state => ({
      running: true,
      interval: setInterval(this.tick, 1000),
      time: state.time 
    }));
  };

  pauseTimer = () => {
    this.state.interval ? this.stopInterval() : this.startTimer();
  };

  getStatus = () => {
    const { time, running, interval } = this.state;
    if (time === 0) return 'Finished';
    if (running && !interval) return 'Paused';
    if (running) return 'Running';
  };

  getProgress = () => {
    const current = this.state.time;
    const total = this.state.setTime;
    return (((total - current) / total) * 100).toFixed(1);
  };

  render() {
    return (
      <div className="Content">
        <div className="Pomodoro">
            <TimeDisplay
              clicked={this.getStatus()==='Running' ? this.pauseTimer : this.startTimer}
              time={this.state.time}
              status={this.getStatus()}
              progress={this.getProgress()}
            />
          <ControlPanel setTime={this.state.setTime} onClickDecrease={this.onClickDecrease} onClickIncrease={this.onClickIncrease}/>
          <SessionCounter sessions={this.state.completedSession}/>
        </div>
      </div>
    );
  }
}

export default Pomodoro;
