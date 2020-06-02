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
      time: 8,
      setTime: 8,
      shortBreakTime: 5,
      longBreakTime: 10,
      longBreakInterval: 4,
      running: false,
      taskStatus:
        JSON.parse(window.localStorage.getItem('pomodoro-react-taskStatus')) ||
        null
      ,
      activity: 'F',     //One of Focus F , Short Break S  or Long Break L
      completedSession : 0,
      intervalToLongBreak: 4
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
    const activity = this.state.activity;
    let intervalToLongBreakToSet = this.state.intervalToLongBreak;
    let timeToSet = this.state.setTime;
    let activityToSet = this.state.activity;
    let newCompletedSession = this.state.completedSession;
    if (this.state.time <= 1) {
      this.stopInterval();
      if(activity=='F'){
        newCompletedSession = this.state.completedSession +1;
        intervalToLongBreakToSet = intervalToLongBreakToSet - 1;
        if(intervalToLongBreakToSet==0){
          timeToSet = this.state.longBreakTime;
          activityToSet = 'L';
          intervalToLongBreakToSet = this.state.longBreakInterval;
        }
        else{
          timeToSet = this.state.shortBreakTime;
          activityToSet = 'S';
        }
      }
      else if(activity=='S'){
        timeToSet = this.state.setTime;
        activityToSet = 'F';
      } 
      else{
        timeToSet = this.state.setTime;
        activityToSet = 'F';
      }
      this.setState({ running: false });
      this.setState(state => ({ time: timeToSet, activity: activityToSet, intervalToLongBreak: intervalToLongBreakToSet, completedSession: newCompletedSession }));
      return;
    }
    this.setState(state => ({ time: this.state.time - 1 }));
  };

  stopInterval = () => {
    clearInterval(this.state.interval);
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
              activity={this.state.activity}
            />
          <ControlPanel setTime={this.state.setTime} onClickDecrease={this.onClickDecrease} onClickIncrease={this.onClickIncrease}/>
          <SessionCounter sessions={this.state.completedSession}/>
        </div>
      </div>
    );
  }
}

export default Pomodoro;
