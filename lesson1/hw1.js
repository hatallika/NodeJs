// const args = process.argv.slice(2);
// const from = parseInt(args[0]);
// const to = parseInt(args[1]);
const colors = require('colors');

const [from, to] = process.argv.slice(2).map(item => parseInt(item));

if(isNaN(from) || isNaN(to)){
    console.log('Incorrect numbers');
}

let idx = 0;
const colorPrint = (num) => {
    const collect = ['green', 'yellow', 'red'];
    console.log(colors[collect[idx]](num));

    if (idx === (collect.length - 1)){
        idx = 0;
    } else {
        idx++;
    }
}

const isPrime = (num) => {
    if (num <= 1) {
        return false
    }
    let i = 2;
    while (i < num ) {
        if(num % i === 0) {
            return false
        }
        i++;
    }
    return true
}

let i = from;
let exists = false;
while ( i <= to) {
    if (isPrime(i)) {
        colorPrint(i);
        exists = true;
    }
    i++;
}
if(!exists){
    console.log('No digital diapason')
}
