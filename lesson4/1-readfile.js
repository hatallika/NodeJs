import fs from 'fs'
import path from 'path'

const fileName = process.argv[2];
const __dirname = 'D:\\Hatallika\\LaravelBack\\untitled\\lesson4'

// import { dirname } from 'path';
// import { fileURLToPath } from 'url';
// const __dirname = dirname(fileURLToPath(import.meta.url));


//path.join(path1, path2) склеивает пути
fs.readFile(path.join(__dirname, fileName), 'utf-8', ((err, data) => console.log(data)))