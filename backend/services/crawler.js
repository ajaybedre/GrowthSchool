const request = require("request-promise");
const cheerio = require('cheerio');



const crawlPage = async(url)=>{
    const response = await request({
        uri:url,
        headers:{
            "path":" /questions/",
            "scheme": "https",
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-encoding": "gzip, deflate, br",
            "accept-language":" en-US,en;q=0.9",
            "cache-control": "max-age=0",
            "cookie": "prov=7cdb645f-d30c-9310-c1dd-70e62fd8fcf5; _ga=GA1.2.658632116.1631252708; OptanonAlertBoxClosed=2021-11-23T15:57:49.372Z; OptanonConsent=isIABGlobal=false&datestamp=Tue+Nov+23+2021+21%3A27%3A49+GMT%2B0530+(India+Standard+Time)&version=6.10.0&hosts=&landingPath=NotLandingPage&groups=C0003%3A1%2CC0004%3A1%2CC0002%3A1%2CC0001%3A1; __gads=ID=48e2e076b14f45a3:T=1637728069:S=ALNI_Mb1Zv0hqsz2tD0z0mEdF9_RW57D1Q; sgt=id=b0398f1c-af70-491f-8af0-90180399408a; acct=t=DGrllJEvFyPNKY0QNK05YXWIJkELO4ME&s=qnlpO4JA%2bVlSXFTr8s2IycG7B2%2fMU4QY; _gid=GA1.2.802373936.1643680329",
            "referer": "https://in.search.yahoo.com/",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36",
        },
        gzip:true
    });
    // console.log('resp',response);
    return response;
}


module.exports.webCrawler = async(req,res,next)=>{
    try{
        // console.log('rac');
        const map = new Map();
        let totalPages =1;// req.body.totalPages || 10;
        const orderBy = 'Active';//req.body.orderBy || 'Active';
        let currentPageNumber = 1;//req.body.startingPage || 1;
        while(totalPages--){

            const url=`https://stackoverflow.com/questions?tab=${orderBy}&page=${currentPageNumber}`;

            const response = await crawlPage(url);

            const $ = await cheerio.load(response);
 
             
            let allQuestionsLinksOnCurrentPage = $('div[class="summary"] > h3 > a');
            
            let upvotesCountForAllQuestions = $('div[class="statscontainer"] div[class="votes"] strong');
            let answersCountForAllQuestions = $('div[class="statscontainer"] div.status > strong');
            let countOfQuestionsOnCurrentPage = allQuestionsLinksOnCurrentPage.length;
 
            // console.log(countOfQuestionsOnCurrentPage);
 
            for(let i=0;i<countOfQuestionsOnCurrentPage;i++){
                 let obj={};
                 questionLink= "https://stackoverflow.com"+$(allQuestionsLinksOnCurrentPage[i]).attr("href");
                 obj.upvotesCount=$(upvotesCountForAllQuestions[i]).text();
                 obj.answersCount=$(answersCountForAllQuestions[i]).text();

                 if(map.has(questionLink)){
                    let tempObj = map.get(questionLink);
                    tempObj.referCount++;
                    map.set(questionLink,tempObj);
                 }else{
                    obj.referCount=1;
                    map.set(questionLink,obj);
                 }

            }
            // console.log('ok');
            currentPageNumber++;
 

        }
        let rawData=[];
        await map.forEach((value,key)=>{
            const {upvotesCount,answersCount,referCount}=value;
            rawData.push({
                questionLink:key,
                upvotesCount,
                answersCount,
                referCount
            });
        })
        
        req.rawData=rawData;
        // console.log('moved');
        next();

    }catch(err){
       console.error("Error while crawling",err);
       return res.status(500).json({
           Error:"Opps, Something went wrong!"
       })
    }
 }
