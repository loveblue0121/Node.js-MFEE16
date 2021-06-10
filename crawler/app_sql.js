const axios = require("axios");
const fs = require("fs/promises");
const moment = require("moment");
const mysql = require("mysql");
const Promise = require("bluebird");
require('dotenv').config();
//資料庫連線
let connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    port     : process.env.DB_PORT,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME
  });

connection = Promise.promisifyAll(connection);

(async function(){
    try{
        await connection.connectAsync();
        let data = await fs.readFile("stock.txt","utf8");//fs.readFile讀檔案
        console.log(`抓到的代碼:${data}`);

        let stock = await connection.queryAsync(`SELECT stock_id FROM stock WHERE stock_id=?`,[data]);
        console.log(stock);
        if(stock.length <= 0){
            let response = await axios.get(`https://www.twse.com.tw/zh/api/codeQuery?query=${data}`);
            //response.data = [ '2330\t台積電', '2330R\t台積甲', '2330T\t台積丙' ]
            let name = response.data.suggestions.shift();//shift()移除陣列最前端項目
            // => 2330    台積電
            let nameSplit = name.split("\t");//split()將字串轉換成陣列 ()內為切割依據 
            //[ '2330', '台積電' ]
            //console.log(nameSplit[1]);
            if (nameSplit.length > 1){//nameSplit.length > 1 =>如果有get到資料
                console.log(`儲存股票名稱 ${nameSplit[0]} ${nameSplit[1]}`);
                console.log("answers:", nameSplit);
                connection.queryAsync(`INSERT INTO stock (stock_id, stock_name) VALUE (?);`,[nameSplit]); 
            }else{
                throw "查詢股票名稱錯誤";
            }
        }
        //表示stock裡，已經有該ID跟NAME
        console.log(`查詢股票成交資料${data}`);
        let response= await axios.get('https://www.twse.com.tw/exchangeReport/STOCK_DAY',
        {
            params:{
            response:"Json",
            date:moment().format("YYYYMMDD"),
            stockNo:data
            },
        }
        );
        if (response.data.stat !== "OK") {
            throw "查詢股價失敗";
        }

        //["日期","成交股數","成交金額","開盤價","最高價","最低價","收盤價","漲跌價差","成交筆數"],
        //['110/06/01','18,405,285','10,985,893,229','598.00','599.00','595.00','598.00','+1.00','20,318']
        //let item = response.data.data[0];
/*每筆資料 insert 的 promise
        let insert = response.data.data.map((item) => {
            item = item.map((value)=>{//.map 方法會建立一個新的陣列,這邊是在處理去掉,後的資料將其建立新的陣列
                return value.replace(/,/g, "");
            });
            // 民國年要換算西元年 +1911,將格式換為YYYY-MM-DD
            item[0] = parseInt(item[0].replace(/\//g, ""), 10) + 19110000;
            item[0] = moment(item[0], "YYYYMMDD").format("YYYY-MM-DD");
            item.unshift(data);
            return connection.queryAsync("INSERT IGNORE INTO stock_price (stock_id, date, volume, amount, open_price, high_price, low_price, close_price, delta_price, transactions) VALUES (?)",[item]);
        })
        
        
        let insertResult = await Promise.all(insert);
        console.log(insertResult);
    }catch(err){
        console.error(err);
    }finally{
         connection.end();
    }

*/
    //批次insert
    let insert = response.data.data.map((item) => {
        item = item.map((value)=>{//.map 方法會建立一個新的陣列,這邊是在處理去掉,後的資料將其建立新的陣列
            return value.replace(/,/g, "");
        });
        // 民國年要換算西元年 +1911,將格式換為YYYY-MM-DD
        item[0] = parseInt(item[0].replace(/\//g, ""), 10) + 19110000;
        item[0] = moment(item[0], "YYYYMMDD").format("YYYY-MM-DD");
        item.unshift(data);
        return item;
    });
    
    let insertResult = await connection.queryAsync("INSERT IGNORE INTO stock_price (stock_id, date, volume, amount, open_price, high_price, low_price, close_price, delta_price, transactions) VALUES ?",[insert]);
    //如果是批次的話 VALUES 後的? 要將()拿掉
    console.log(insertResult);
}catch(err){
    console.error(err);
}finally{
     connection.end();
}
})();

