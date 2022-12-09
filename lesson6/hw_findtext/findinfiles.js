#!/usr/bin/env node
import {Worker, workerData} from 'worker_threads';
import inquirer from "inquirer";
import fsp from 'fs/promises';
import path from 'path';
// const __dirname = process.cwd();
import readline from 'readline';
import os from "os";
import colors from "colors";
const {EOL} = os;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const root = process.cwd();
const start = (workerData) => {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./worker.js', {workerData});
        worker.on('message', resolve);
        worker.on('error', reject);
    })
}


const readFileDir = (dirPath) => {
     return fsp
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
                return inquirer.prompt([
                    {
                        name: 'fileName',
                        type: 'list', //input, number, confirm, list, rawlist, expand, checkbox, password
                        message: 'Choose file',
                        choices: list,
                    },
                    // {
                    //     name: 'findString',
                    //     type: 'input',
                    //     message: "Enter something for search"
                    // }
                    ]
                    )
                    .then(async ({fileName}) => {
                        const fullPath = path.join(dirPath,fileName);

                        const src = await fsp.stat(fullPath);

                        if(src.isFile()){
                            return inquirer.prompt({
                                name: 'findString',
                                type: 'input',
                                message: "Enter something for search"
                            }).then(async ({findString}) => {
                                return Promise.all([
                                    fsp.readFile(fullPath, 'utf-8'),
                                    Promise.resolve(findString),
                                ]);
                            })

                        } else {
                            return readFileDir(fullPath)
                        }
                    })

                    .then((result) => {
                        if(result) {
                            //worker
                            start(result)
                                .then(result => console.log(result.file_text, EOL, colors.green(`Found ${result.count} values`)))
                                .catch(error => console.log(error));
                        }
                    })
                    }
        })

}

rl.question(`You are here: ${root}.${EOL}Please, enter the file path `, (inPath) => {
    readFileDir(path.join(root,inPath));
});
rl.on('close', ()  => process.exit(0))

