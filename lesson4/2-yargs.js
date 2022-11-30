import yargs from "yargs";
import {hideBin} from 'yargs/helpers'

const options = yargs(hideBin(process.argv))
    .usage('Usage: -p <path>')
    .option('p', {alias: 'path', describe: 'Path to file', demandOption: true })
    .argv;
console.log(options);