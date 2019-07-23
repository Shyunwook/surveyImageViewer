const express = require('express');
const path = require('path');
const engine = require('ejs-locals');
const AWS = require('aws-sdk');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');

const app = express();

app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (_, res) => {
    AWS.config.accessKeyId = "AKIAIXBW7VDZ4WIBEWFA";
    AWS.config.secretAccessKey = "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";
    AWS.config.region = 'ap-northeast-2';

    var s3 = new AWS.S3();
    s3.listObjects({ Bucket : 'survey.image' }).on('success', function handlePage(response) {
        var fileList = [];
        for(var name in response.data.Contents){
            fileList.push(response.data.Contents[name].Key.split('/')[1]);
        }
        res.render('index.ejs', { fileList : JSON.stringify(fileList) });
    }).send();
})

app.get('/mint', async (req, res) => {
    let brand = fs.readFileSync(`brand.txt`, 'utf8');
    brand = brand.split('\n');
    let result = ''
    for(i in brand){
        result += await getRelate(brand[i]);
        result += `</br>`
    }
    res.send(result);
});

function getRelate(brand){
    return new Promise((resolve, reject) => {
        var url = `https://search.naver.com/search.naver?ie=UTF-8&query=${encodeURIComponent(brand)}`;
        request({
            url : url,
            method : 'GET'
        },(err, response, data) => {
            if(response.statusCode == 200){
                let arr = parseRelate(brand,data);
                resolve(arr.toString());
            }
        });
    })
};

function parseRelate(brand,body){
    $ = cheerio.load(body);
    let keywords = $('#nx_related_keywords>dl>dd.lst_relate>ul>li>a');
    let result = [brand];
    console.log(keywords.length);
    for(let i = 0; i < keywords.length; i ++ ){
        if(brand=="라네즈") console.log($(keywords[i]).text());
        result.push($(keywords[i]).text());
    }
    return result;
}

app.listen('3000',() => {
    console.log('app is running....!');
})