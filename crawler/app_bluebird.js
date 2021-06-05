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
//用bluebird 包 callback版本的readFile
const readFileBlue = Promise.promisify(fs.readFile);

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




