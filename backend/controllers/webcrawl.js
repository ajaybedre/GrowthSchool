const {parse} =require('json2csv');

module.exports.startCrawling = async(req,res)=>{
    try{

        const csvData = parse(req.rawData);
        return res.status(200).json({Data:csvData});
        // return res.render('index',{Data:csvData});
    }catch(err){
        console.error("Error-- while crawling",err);
        res.status(500).json({
            Error:"Opps, Something went wrong!"
        })
    }
}