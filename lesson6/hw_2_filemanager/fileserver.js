import http from "http";
import path from "path";
import fs from "fs";
import os from "os";

const {EOL} = os;
import fsp from "fs/promises";
import stream from "stream";
import {Server} from "socket.io";
import {Worker} from "worker_threads";
import colors from "colors";

const  {Transform} = stream;

const host = 'localhost';
const port = 3000;
const __root = process.cwd();
const indexFile = './lesson6/hw_2_filemanager/index.html'; //must contain #filelinks#"
let countStr;

const start = (workerData) => {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./lesson6/hw_2_filemanager/worker.js', {workerData});
        worker.on('message', resolve);
        worker.on('error', reject);
    })
}

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
        let findStr = request.url.split("?")[1];

        const curPath = path.join(__root, url);

        fs.stat(curPath, (err, stats) => {
            if(!err){
                //если файл
                // выведем поиск строки в нем
                if(stats.isFile(curPath)){
                    const search = '<form action="'+ url +'" method="GET">' +
                        '<input type="text" placeholder="Search text in file" id="str" name="str"><br>' +
                        '<input type="submit" value="search">' +
                        '</form>'
                    renderToIndex(search, response);

                    //если есть параметры файла
                    if(findStr){
                        switch (findStr.split('=')[0]) {
                            //параметр - поиск строки  - ищем строку
                            case 'str':
                                let str = findStr.split('=')[1];
                                let countStr;
                                //назначаем поиск в воркер
                                start({path: curPath, str: str})
                                    .then(result =>  {
                                        console.log(colors.green(`${EOL}Found ${result.count} values`));

                                    })
                                    .catch(error => console.log(error));
                                const rs = fs.createReadStream(curPath, 'utf-8');
                        }
                    }

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

});

const io = new Server(server);
let allClients = [];
io.on('connection', (client) => { // в cb доступен наш клиент, который подключается
                                  //Generate name

    allClients.push(client);
    //for client
    client.emit('current_counter', {count: allClients.length });
    //broadcast
    client.broadcast.emit('update_counter', {count: allClients.length });

    client.on('disconnect', () => {
        let i = allClients.indexOf(client);
        allClients.splice(i,1);
        client.broadcast.emit('update_counter', {count: allClients.length });
    });

})


server.listen(port, host, () => console.log(`Server running at http://${host}:${port}`));