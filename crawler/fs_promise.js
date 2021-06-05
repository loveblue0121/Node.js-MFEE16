const axios = require("axios");
const moment = require("moment");
//引入promise版本的fs
const fs = require("fs/promises");  //這樣拿到的fs版本就是promise版本的
/* 調整時區 時間差
console.log(moment().utcOffset(+8).format("YYYYMMDD HH:mm")); 
return;
*/
var nowDate = moment().utcOffset(+8).format("YYYYMMDD");

/* 不需要再自己包裝了
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
*/
//因為是promise版本，所以會回傳promise物件
fs.readFile("stock.txt","utf8")
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




