import {workerData, parentPort} from "worker_threads";
import fs from "fs";
import colors from "colors";

const {path, str} = workerData;
const pattern = new RegExp(str, 'g');

const rs = fs.createReadStream(path, 'utf8');

import stream from 'stream';
const {Transform} = stream;
let count = 0;
const transformStream = new Transform({
    transform(chunk, encoding, callback) {

        const transformedChunk = chunk.toString().replace(pattern, () => {
            count++;
            // console.log(transformedChunk);
            return colors.red(str)
        });


        this.push(transformedChunk);
        parentPort.postMessage({count: count})
        callback();
    }
})

//показать цветом в консоли найденные строки
rs.pipe(transformStream).pipe(process.stdout);








// const ts = new Transform({
//     transform(chunk, encoding, callback) {
//
//         this.push(chunk.toString().replace("#filelinks#", data));
//         callback();
//     },
// });
//
// rs.pipe(ts).pipe(func)


//
//
// const pattern = new RegExp(findString, 'g');
// let count = 0;
// const out = text.replace(pattern, () => {
//     count++;
//     return colors.red(findString)
// });
// parentPort.postMessage({file_text: out, count: count})
