import fs from 'fs';
import yargs from "yargs";
import {hideBin} from 'yargs/helpers';

import path from 'path';
const __dirname = 'D:\\Hatallika\\LaravelBack\\untitled\\lesson4';

const options = yargs(hideBin(process.argv))
    .usage('Usage: -p <path>')
    .option('p', {
        alias: 'path',
        describe: 'Path to file',
        demandOption: true
    }).argv;

const fileName =options.path

fs.readFile(path.join(__dirname, fileName), 'utf-8', ((err, data) => console.log(data)))