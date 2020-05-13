const express = require("express");
const router = express.Router();
const User = require("../../model/User");

router.post("/:id",(req,res)=>{
    User.findOne({userName:req.params.id})
    .then(user=>{
        user.pomodoro.push({startTime:Date.now(),endTime:Date.now()});
        user.save();
        res.json({success:true})
    })

});
module.exports = router;