const express = require("express");
const path = require("path");
const engine = require("ejs-locals");
require("dotenv").config();
const AWS = require("aws-sdk");
AWS.config.update({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  egion: "ap-northeast-2"
});
const s3 = new AWS.S3();

// const fs = require("fs");
// const request = require("request");
// const cheerio = require("cheerio");

const app = express();

app.engine("ejs", engine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

let params = {
  Bucket: "survey.image",
  Delimiter: "/",
  Prefix: "may/"
};

(async () => {})();

app.get("/", async (_, res) => {
  const dataList = await s3.listObjects(params).promise();
  dataList.Contents.shift();
  let fileList = [];
  dataList.Contents.forEach(data => {
    fileList.push(data["Key"].split("/")[1]);
  });
  res.render("survey.ejs", { fileList: JSON.stringify(fileList) });
});

// app.get('/mint', async function(req, res){
//     let brand = fs.readFileSync(`brand.txt`, 'utf8');
//     brand = brand.split('\n');
//     let result = ''
//     for(i in brand){
//         result += await getRelate(brand[i]);
//         result += `</br>`
//     }
//     res.send(result);
//     // getRelate(brand[0],res);
// });

// function getRelate(brand){
//     return new Promise(function(resolve, reject){
//         var url = `https://search.naver.com/search.naver?ie=UTF-8&query=${encodeURIComponent(brand)}`;
//         request({
//             url : url,
//             method : 'GET'
//         },(err, response, data) => {
//             // res.send(data);
//             if(response.statusCode == 200){
//                 let arr = parseRelate(brand,data);
//                 resolve(arr.toString());
//             }
//         });
//     });
// };

// function parseRelate(brand,body){
//     $ = cheerio.load(body);
//     let keywords = $('#nx_related_keywords>dl>dd.lst_relate>ul>li>a');
//     let result = [brand];
//     console.log(keywords.length);
//     for(let i = 0; i < keywords.length; i ++ ){
//         result.push($(keywords[i]).text());
//     }
//     return result;
// }

app.listen("3000", () => {
  console.log("app is running....!");
});
