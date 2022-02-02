const router = require('express').Router();

const { startCrawling} = require('../controllers/webcrawl');

const {webCrawler} = require('../services/crawler');

router.get('/webcrawl/start',webCrawler ,startCrawling);







module.exports =router;