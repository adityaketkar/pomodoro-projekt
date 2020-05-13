const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const app = express();
const createNewUser = require("./routes/api/createNewUser");
const createNewPomodoro = require("./routes/api/createNewPomodoro");
app.use(bodyParser.json());
const db = require('./config/keys').mongoURI;
mongoose.connect(db,{useUnifiedTopology:true})
    .then(() => console.log("Connected Successfully"))
    .catch(err => console.log(err))

const port = process.env.port || 5001;

app.use("/api/createNewUser",createNewUser);
app.use("/api/createNewPomodoro",createNewPomodoro);
app.listen(port,()=>{
    console.log(`Server started on port ${port}`)
})