import {workerData, parentPort} from "worker_threads";
import colors from "colors";

const [text, findString] = workerData;
const pattern = new RegExp(findString, 'g');
let count = 0;
const out = text.replace(pattern, () => {
    count++;
    return colors.red(findString)
});
parentPort.postMessage({file_text: out, count: count})
