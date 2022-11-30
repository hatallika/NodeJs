import readline from 'readline';
import fs from 'fs';
import path from 'path';

const __dirname = 'D:\\Hatallika\\LaravelBack\\untitled\\lesson4';



const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Please enter the path to the file: ', (fileName) => {

    fs.readFile(path.join(__dirname, fileName), 'utf-8', (err, data) => {
        console.log(data);
        rl.close();
    });
});

rl.on('close', () => process.exit(0));