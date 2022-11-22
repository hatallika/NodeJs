const colors = require('colors/safe');
let [n1,n2] = process.argv.slice(2);

const colorsItems = [colors.red, colors.green, colors.yellow];

function isSimple (n) {
    if (n === 1 || n === 0) {
        return false;
    } else {
        for(let i = 2; i < n; i++) {
            if(n % i === 0) {
                return false;
            }
        }
        return true;
    }
}

if(isNaN(n2) || isNaN(n1)){
    console.log(colors.red('Интервал должен быть задан числами. Например 2 100'));
} else {
    n1 = parseInt(n1);
    n2 = parseInt(n2);

    if (n2 < n1) {
        console.log(colors.red('Указан не верный диапазон чисел. Укажите диапазон по возрастанию'));
    } else {
        let j = 1;
        for (let i = n1;  i <= n2; i++){
            if (isSimple(i)) {
                console.log(colorsItems[j % 3](i));
                j++;
            }
        }
        if (j === 1) {
            console.log(colors.red("Нет простых чисел в диапазоне"));
            // process.exit();
        }
    }
}





