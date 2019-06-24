const express = require('express');
const path = require('path');
const engine = require('ejs-locals');
const AWS = require('aws-sdk');
const fs = require('fs');

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
        // var temp = [];
        // for(let i = 0; i < 100; i ++ ){
        //     temp.push(fileList[i]);
        // }
        res.render('index.ejs', { fileList : JSON.stringify(fileList) });
        // console.log(response.data.Contents);
        // if (response.hasNextPage()) {
        //     response.nextPage().on('success', handlePage).send();
        // }
    }).send();
})

app.listen('3000',() => {
    console.log('app is running....!');
})