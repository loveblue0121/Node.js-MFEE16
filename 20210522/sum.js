
function sum(n){
    let sum=0;
    for(let i=0; i<=n; i++){
        sum+=i;
    }
    return sum;
    
}
console.log(sum(1)); // 1
console.log(sum(2)); // 3
console.log(sum(10)); // 55
console.log(sum(100000)); // 5000050000