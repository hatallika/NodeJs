import http from "http";
import {Server}from "socket.io";

import fs from "fs";
import path from "path";
import {uniqueNamesGenerator, names} from "unique-names-generator";

const host = "localhost";
const port = 3000;

const server = http.createServer((req, res) => {
  if (["GET", "POST", "PUT"].includes(req.method)) {

    const filePath = path.join(process.cwd(), "./lesson6/hw_1_messenger/index.html");
    const rs = fs.createReadStream(filePath);

    rs.pipe(res);
  }
});

const io = new Server(server);
let allClients = [];
io.on('connection', (client) => { // в cb доступен наш клиент, который подключается
  //Generate name
  let name = uniqueNamesGenerator({dictionaries : [names]});
  // for client
  client.emit('NameForChat', {client_id: client.id, client_name: name });
  //broadcast
  client.broadcast.emit('client_connect', {client_name: name });
  allClients.push(client);

  client.on('disconnect', () => {
      let i = allClients.indexOf(client);
      allClients.splice(i,1);
      client.broadcast.emit('client_disconnect', {client_name: name});
  });

  client.on('reconnect', () => {
        client.broadcast.emit('client_reconnect', {client_name: name});
  });


  //приняли сообщение с сервера от клиента через событие
  client.on('client-msg', (data) => {
    client.broadcast.emit('server_msg', {msg: data.msg, name: data.client_name});
    client.emit('server_msg', {msg: data.msg, name: data.client_name});
  });

})

server.listen(port, host, () =>
  console.log(`Server running at http://${host}:${port}`)
);
