const RequestQueue = require('node-request-queue');
 

module.exports.concurrency =async(req,res)=>{
    let request = {
        method: 'GET',
        uri: 'http://localhost:8900/webcrawl/start'
    }
    let rq = new RequestQueue(5);
 

    rq.on('resolved', response => {
        return res.status(200).json({Data:response.Data})
    }).on('rejected', err => {
        return res.status(500).json({
            Error:err.Error
        })
    });
 
    // Add a single request to end of queue
    rq.push(request);
}

