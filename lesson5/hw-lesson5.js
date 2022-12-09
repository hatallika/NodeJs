import http from "http";
import path from "path";
import fs from "fs";
import os from "os";
import url from "url";
const {EOL} = os;
import fsp from "fs/promises";
import stream from "stream";
const  {Transform} = stream;

const host = 'localhost';
const port = 3000;
const __root = process.cwd();
const indexFile = 'src/index.html'; //must contain #filelinks#"

const links = (arr, currentUrl) => {
    if(currentUrl.endsWith("/")){

        currentUrl = currentUrl.substring(0, currentUrl.length-1); //удалили "/" в конце пути
    }
    let linkList = "<ul>";
    arr.forEach( item => {
        linkList += `<li><a href="${currentUrl}/${item}">${item}</a></li>${EOL}`
    });
    return `${linkList}</ul>${EOL}`;
}

const renderToIndex = async (data, func) => {

        //render for index.html in #filelinks#
        const filePath  = path.join(__root, indexFile);
        const rs = fs.createReadStream(filePath);
        const ts = new Transform({
            transform(chunk, encoding, callback) {
                 this.push(chunk.toString().replace("#filelinks#", data));
                callback();
            },
        });

        rs.pipe(ts).pipe(func)
}


const server = http.createServer(async (request, response) => {

    if (request.method === 'GET') {

        //url из запроса без параметров
        const url = request.url.split("?")[0];
        const curPath = path.join(__root, url);

        fs.stat(curPath, (err, stats) => {
            if(!err){
                //если файл - отдадим его в загрузку
                if(stats.isFile(curPath)){
                    const rs = fs.createReadStream(curPath, 'utf-8');
                    rs.pipe(response)
                } else { //если директория
                    fsp.readdir(curPath)
                        .then((files) => {
                            if(url !== "/") files.unshift("..");
                            return files;
                        })
                        .then((data) => {
                            const list = links(data, url);

                            renderToIndex(list, response);
                        });
                }
            } else {
                let result = `404. Path not exists </br> <a href="/">На главную</a>`
                renderToIndex(result, response);
            }
        });
    }

    // response.writeHead(200, {'Content-Type': 'text/html'});
});

server.listen(port, host, () => console.log(`Server running at http://${host}:${port}`));