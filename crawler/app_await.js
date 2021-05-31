const axios = require("axios");
const fs = require("fs");
const moment = require("moment");

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


async function getapp(){
    try{
        let result=await fsPromise();
        let response= await axios.get('https://www.twse.com.tw/exchangeReport/STOCK_DAY',
        {
            params:{
            response:"Json",
            date:moment().format("YYYYMMDD"),
            stockNo:result
            },
        }
        );
        
           if (response.data.stat === "OK") {
                console.log("日期:",response.data.date);
                console.log(response.data.title);
            }    
    }catch{
        console.error("錯誤",err);
    }
};
getapp();


