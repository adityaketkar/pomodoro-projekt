import React, { Component } from 'react';
import TimeDisplay from '../components/TimeDisplay/TimeDisplay';
import './Pomodoro.css';
import ControlPanel from '../components/ControlPanel/ControlPanel';
import CountDisplay from '../components/CountDisplay/CountDisplay';
import Axios from 'axios';

class Pomodoro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      interval: false,
      time: 0,
      setTime: 1500,
      shortBreakTime: 300,
      longBreakTime: 900,
      longBreakInterval: 4,
      running: false,
      taskStatus:
        JSON.parse(window.localStorage.getItem('pomodoro-react-taskStatus')) ||
        null
      ,
      activity: 'F',     //One of Focus F , Short Break S  or Long Break L
      completedSession : 0,
      intervalToLongBreak: 4,
      dailyTarget: 12
    };
  }

  componentDidMount = () =>{
    const newState = {
      ...this.state,
      time : this.state.setTime,
    }
    this.setState(newState);
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

  onClickIncreaseFocus = () => {
    const newSetTime = this.state.setTime + 60;
    const newState = {
      ...this.state,
      setTime : newSetTime,
    }
    this.setState(newState);
  }

  onClickDecreaseFocus = () => {
    if(this.state.setTime<=60) return;
    const newSetTime = this.state.setTime - 60;
    const newState = {
      ...this.state,
      setTime : newSetTime,
    }
    this.setState(newState);
  }

  onClickIncreaseLong = () => {
    const newSetTime = this.state.longBreakTime + 60;
    const newState = {
      ...this.state,
      longBreakTime : newSetTime,
    }
    this.setState(newState);
  }

  onClickDecreaseLong = () => {
    if(this.state.longBreakTime<=60) return;
    const newSetTime = this.state.longBreakTime - 60;
    const newState = {
      ...this.state,
      longBreakTime : newSetTime,
    }
    this.setState(newState);
  }

  onClickIncreaseShort = () => {
    const newSetTime = this.state.shortBreakTime + 60;
    const newState = {
      ...this.state,
      shortBreakTime : newSetTime,
    }
    this.setState(newState);
  }

  onClickDecreaseShort = () => {
    if(this.state.shortBreakTime<=60) return;
    const newSetTime = this.state.shortBreakTime - 60;
    const newState = {
      ...this.state,
      shortBreakTime : newSetTime,
    }
    this.setState(newState);
  }

  onClickIncreaseInterval = () => {
    const newInterval = this.state.longBreakInterval + 1;
    const newState = {
      ...this.state,
      longBreakInterval : newInterval,
    }
    this.setState(newState);
  }

  onClickDecreaseInterval = () => {
    if(this.state.longBreakInterval<=1) return;
    const newInterval = this.state.longBreakInterval - 1;
    const newState = {
      ...this.state,
      longBreakInterval : newInterval,
    }
    this.setState(newState);
  }

  onClickIncreaseTarget = () => {
    const newTarget = this.state.dailyTarget + 1;
    const newState = {
      ...this.state,
      dailyTarget : newTarget,
    }
    this.setState(newState);
  }

  onClickDecreaseTarget = () => {
    if(this.state.dailyTarget<=1) return;
    const newTarget = this.state.dailyTarget - 1;
    const newState = {
      ...this.state,
      dailyTarget : newTarget,
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
    this.setState({ interval: null });
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
    return 'Click to Begin!'
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
          <div className="VerticalModule">
            <CountDisplay displayMessage="Your Pomo-Count" count={this.state.completedSession}/>
            <CountDisplay displayMessage="Pomo to Long Break" count={this.state.intervalToLongBreak}/>
          </div>    
          <div className="VerticalModule">
            <ControlPanel displayMessage='Focus Time' setTime={this.state.setTime} onClickDecrease={this.onClickDecreaseFocus} onClickIncrease={this.onClickIncreaseFocus}/>
            <ControlPanel displayMessage='Short Break Time' setTime={this.state.shortBreakTime} onClickDecrease={this.onClickDecreaseShort} onClickIncrease={this.onClickIncreaseShort}/>
            <ControlPanel displayMessage='Long Break Time' setTime={this.state.longBreakTime} onClickDecrease={this.onClickDecreaseLong} onClickIncrease={this.onClickIncreaseLong}/>
            <ControlPanel timeView = 'false' displayMessage='Long Break Interval' setTime={this.state.longBreakInterval} onClickDecrease={this.onClickDecreaseInterval} onClickIncrease={this.onClickIncreaseInterval}/>
            <ControlPanel timeView = 'false' displayMessage='Daily Target' setTime={this.state.dailyTarget} onClickDecrease={this.onClickDecreaseTarget} onClickIncrease={this.onClickIncreaseTarget}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Pomodoro;
