const express = require("express");
const router = express.Router();
const User = require("../../model/User");

//@route Post api/createNewUser
//@desc Creates a user 
router.post("/",(req,res)=>{
    const newUser = new User({
        userName: req.body.userName
    });
    newUser.save().then(()=>{res.json(newUser)});
});
module.exports = router;