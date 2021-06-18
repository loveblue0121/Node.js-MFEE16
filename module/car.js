const car = {
    name: "toyota",
    color: "blue",
};
exports.getColor = function(){
    return car.color;
}
exports.setColor = function(color){
    car.color = color ;
}
//module.exports = car 就是把整個 car 物件 export 出去
//exports 的語法只能 export 你指定的東西，其他的都還會是 private
exports.car = car;