import inquirer from "inquirer";
import fsp from 'fs/promises';
import path from 'path';
// const __dirname = process.cwd();
import readline from 'readline';
import os from "os";
const {EOL} = os;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const root = process.cwd();


const readFileDir = (dirPath) => {
     fsp
        .readdir(dirPath)
        .then((list) => {
            if (list.length === 0){
                return inquirer.prompt({
                    name: 'toBack',
                    type: 'list', //input, number, confirm, list, rawlist, expand, checkbox, password
                    message: 'Empty directory',
                    choices: ['to return'],
                }).then(async () => {
                    readFileDir(path.dirname(dirPath));
                })
            } else {
                return inquirer.prompt({
                name: 'fileName',
                type: 'list', //input, number, confirm, list, rawlist, expand, checkbox, password
                message: 'Choose file',
                choices: list,
                })
                    .then(async ({fileName}) => {

                        const src = await fsp.stat(path.join(dirPath,fileName));

                        if(src.isFile()){
                             fsp.readFile(path.join(dirPath,fileName), 'utf-8').then(console.log)
                        } else {
                            readFileDir(path.join(dirPath,fileName))
                        }

                    }
                )
                    }

        })

}

rl.question(`You are here: ${root}.${EOL}Please, enter the file path `, (inPath) => {
    readFileDir(path.join(root,inPath));
});
rl.on('close', ()  => process.exit(0))

