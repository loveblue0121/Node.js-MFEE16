const axios = require('axios');

axios.get('https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date=20210523&stockNo=2330')
  .then(function (response) {
    if(response.status===200){
        console.log(response);
    }else{
        console.log(error());
    }
    
  })