import inquirer from "inquirer";

import fsp from 'fs/promises';
import path from 'path';

// const __dirname = 'D:\\Hatallika\\LaravelBack\\untitled\\lesson4';
const __dirname = process.cwd();

const readFile = (dirPath) => {
    console.log('path: ', dirPath);
    fsp
        .readdir(path.join(dirPath))
        // .then(async (indir) => {
        //
        //     const list = [];
        //     for (const item of indir) {
        //         const src = await fsp.stat(item)
        //         if(src.isFile()){
        //             list.push(item)
        //         }
        //     }
        //
        //     return list
        // })
        .then((list) => {
            return inquirer.prompt({
                name: 'fileName',
                type: 'list', //input, number, confirm, list, rawlist, expand, checkbox, password
                message: 'Choose file',
                choices: list,
            })
        })
        .then(async ({fileName}) => {

            const src = await fsp.stat(path.join(dirPath,fileName));

            if(src.isFile()){
                return fsp.readFile(path.join(dirPath,fileName), 'utf-8')
            } else {
                 readFile(path.join(dirPath,fileName))
            }
        }).then(console.log)
}


readFile(__dirname);

    // fsp
    //     .readdir(path.join(__dirname))
    //     .then(async (indir) => {
    //
    //         const list = [];
    //         for (const item of indir) {
    //             const src = await fsp.stat(item)
    //             if(src.isFile()){
    //                 list.push(item)
    //             }
    //         }
    //
    //         return list
    //     })
    //     .then((list) => {
    //         return inquirer.prompt({
    //             name: 'fileName',
    //             type: 'list', //input, number, confirm, list, rawlist, expand, checkbox, password
    //             message: 'Choose file',
    //             choices: list,
    //         })
    //     })
    //     .then(({fileName}) => fsp.readFile(fileName, 'utf-8'))
    //     .then(console.log);


