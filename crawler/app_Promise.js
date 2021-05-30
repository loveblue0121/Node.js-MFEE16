const axios = require("axios");
const moment = require("moment");
const fs = require("fs");
/* 調整時區 時間差
console.log(moment().utcOffset(+8).format("YYYYMMDD HH:mm")); 
return;
*/
var nowDate = moment().utcOffset(+8).format("YYYYMMDD");



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
fsPromise()
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




