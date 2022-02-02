const express = require('express')
const app = express();

const cors = require('cors');

const port =8800;
const { concurrency } = require('./concurrency');

app.use(express.json());

app.use(cors(
    {
      origin: "http://localhost:3000", // allow to server to accept request from different origin
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true // allow session cookie from browser to pass through
    }
));


app.get('/crawler/start',concurrency);



app.listen(port,(err)=>{
    if(err){
        console.error(`Error while running server ${err}`);
    }else{
        console.log(`Server started on port ${port}`);
    }
})
