const car = require ("./car");
console.log(car);
/*{
    getColor: [Function (anonymous)],
    setColor: [Function (anonymous)],
    car: { name: 'toyota', color: 'blue' }
  }
*/

console.log(car.getColor());
//blue
car.setColor("green");
console.log(car.getColor());
//green