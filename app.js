const express = require('express');
const path = require('path');
const engine = require('ejs-locals');
const fs = require('fs');

const app = express();

app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (_, res) => {
    fs.readdir('./public/images', function(err, filelist){
        if(err){
            res.send(err);
        }else{
            res.render('index.ejs', { fileList : JSON.stringify(filelist) });
        }
    })
})

app.listen('3000',() => {
    console.log('app is running....!');
})