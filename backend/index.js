const express = require('express')
const app = express();

const cors = require('cors');
// const { concurrency } = require('./services/concurency');

const port =8900;




app.use(express.json());

app.use(cors(
    {
      origin: "http://localhost:3000", // allow to server to accept request from different origin
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true // allow session cookie from browser to pass through
    }
));

app.use('/',require('./routes'));



app.listen(port,(err)=>{
    if(err){
        console.error(`Error while running server ${err}`);
    }else{
        console.log(`Server started on port ${port}`);
    }
})
