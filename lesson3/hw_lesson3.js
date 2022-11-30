// const fs = require('fs');
import fs from 'fs';

const config = {
    file: "access_tmp.log",
    logsDir: "logs",
    ipSearch: ["89.123.1.41", "34.48.240.111"],
    suffix: "_requests.log",
}

// const {Transform} = require("stream");
// const {EOL} = require("os"); //\n\r
import {EOL} from "os";
import {Transform} from "stream"



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