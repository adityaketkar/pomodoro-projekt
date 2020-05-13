const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PomodoroSchema = new Schema({
    startTime:{
        type:Number,
        default:Date.now()
    },
    endTime:{
        type:Number,
        default:Date.now()
    }
});

const UserSchema = new Schema({
    pomodoro:[PomodoroSchema],
    userName:{
        type:String,
        require:true
    }
});

module.exports = User = mongoose.model("user",UserSchema);