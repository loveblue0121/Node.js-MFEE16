//JQuery.ajax去取得api/stocks的資料
$(function(){
    $.ajax({
            type: "GET",
            url: "/api/stocks",
        }).done(function(data){
            console.log(data);
        });
    //AXIOS
    axios.get("/api/stocks")
    .then(function(response){
        console.log(response.data);
    });

    //fetch
    fetch("/api/stocks")
    .then(function(response){
        return response.json(); //輸出成json
    }).then(function(data){
        console.log(data);
    })
})


    
