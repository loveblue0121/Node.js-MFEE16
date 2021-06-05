const axios = require("axios");
const moment = require("moment");
const fs = require("fs");
const Promise = require("bluebird");
//console.log(Promise);
/* 調整時區 時間差
console.log(moment().utcOffset(+8).format("YYYYMMDD HH:mm")); 
return;
*/
var nowDate = moment().utcOffset(+8).format("YYYYMMDD");


/* 因為使用bluebird
function fsPromise(){
  return new Promise((resolve, reject) => {
    fs.readFile("stock.txt","utf8",(err, data) =>{
        if(err){
          reject(err)
        }
        resolve(data);
    });
  });
}
*/
// 方法1: 一個函式一個函式包
//用bluebird 包 callback版本的readFile
const readFileBlue = Promise.promisify(fs.readFile);

/*方法2: 整個 fs 都包起來
把 fs 所有的 function 都包成 promise
但是原本的函式名稱後面會被加上 Async

const fsBlue = Promise.promisifyAll(fs);
fsBlue
  .readFileAsync("stock.txt", "utf-8")
*/
readFileBlue("stock.txt","utf8")
    .then((data)=>{
        console.log(`讀到的: ${data}`);
        return axios.get('https://www.twse.com.tw/exchangeReport/STOCK_DAY',
        {params:{
            response:"Json",
            date:nowDate,
            stockNo:data
            },
        });        
    })
    .then(function (response) {
        if (response.data.stat === "OK") {
            console.log("日期:",response.data.date);
            console.log(response.data.title);
        }
    })
    
    .catch((err)=>{
        console.error(err);
    })




