import fs from 'fs';
import stream from "stream";
const  {Transform} = stream

import os from "os";
const {EOL} = os;

import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const config = {
    file: "access_tmp.log",
    logsDir: "logs",
    ipSearch: ["89.123.1.41", "34.48.240.111"],
    suffix: "_requests.log",
}

const searchIpAndWriteLog = (ip, stream) => {

    const fileWrite = new fs.WriteStream(`${__dirname}/${config.logsDir}/${ip}${config.suffix}`, {
        flags: 'a', encoding: 'utf-8'
        });

    const search = new RegExp(`(${ip}.*)`, 'g'); // /(89.123.1.41.*)/g

    const transformStream = new Transform({
        transform(chunk, encoding, callback) {
            const transformedChunk = chunk.toString().match(search);

            if (transformedChunk) {
                transformedChunk.forEach(line => this.push(line + EOL))
            }

            callback();
        }
    });

    fileWrite.end(() => {
        console.log('-----------------------------------------------');
        console.log(`${ip}${config.suffix} file writing finished`);
        console.log('-----------------------------------------------');
    });


    stream.pipe(transformStream).pipe(fileWrite);


}
const lesson3 = () => {

    const readStream = new fs.ReadStream(`${__dirname}/${config.file}`, 'utf8');

    config.ipSearch.forEach(ip => searchIpAndWriteLog(ip, readStream));
}


lesson3();