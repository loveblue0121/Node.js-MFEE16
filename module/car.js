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
exports.car = car;