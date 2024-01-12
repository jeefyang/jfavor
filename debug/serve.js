"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteServe = void 0;
const fs = require("fs");
const http = require("http");
const path = require("path");
class FavoriteServe {
    constructor(config) {
        this.config = config;
        this.hostName = "localhost";
        this.init();
    }
    init() {
        this.server = http.createServer((req, res) => {
            // let urlParase = new URL(request.url)
            let newFilePath;
            let maxTimeFile;
            fs.readdirSync(this.config.favoriteDir).forEach(name => {
                let filePath = path.join(this.config.favoriteDir, name);
                let stat = fs.statSync(filePath);
                // console.log(stat)
                if (stat.isFile()) {
                    let time = stat.mtimeMs;
                    if (!maxTimeFile || maxTimeFile < time) {
                        newFilePath = filePath;
                        maxTimeFile = time;
                    }
                }
            });
            if (!newFilePath) {
                res.write("fuck world"); //将index.html显示在客户端
                res.end();
                return;
            }
            let favoriteData = fs.readFileSync(path.join(newFilePath), "utf-8");
            let url = req.url;
            let indexHtml;
            if (url == "/") {
                url = this.config.webIndex;
                indexHtml = fs.readFileSync(path.join(this.config.webDir, url), "utf-8");
                indexHtml = indexHtml.replace("$getfavoritesUrl$.url", `\`${favoriteData}\``);
                res.write(indexHtml); //将index.html显示在客户端
                res.end();
            }
            else if (url == "/upload") {
                //   res.writeHead(200,{})
                //新建一个空数组接受流的信息
                let chunks = [];
                //获取的长度
                let num = 0;
                req.on("data", (chunk) => {
                    chunks.push(chunk);
                    num += chunk.length;
                });
                req.on("end", () => {
                    //最终流的内容本体
                    let buffer = Buffer.concat(chunks, num);
                    // 新建数组接收出去\r\n的数据下标
                    let rems = [];
                    // 根据\r\n分离数据和报头
                    for (let i = 0; i < buffer.length; i++) {
                        let v = buffer[i];
                        let v2 = buffer[i + 1];
                        // 10代表\n 13代表\r
                        if (v == 13 && v2 == 10) {
                            rems.push(i);
                        }
                    }
                    let msg = buffer.slice(rems[0] + 2, rems[1]).toString();
                    let fileName = msg.match(/filename=".*"/g)[0].split('"')[1];
                    console.log(fileName);
                    let buf = buffer.slice(rems[3] + 2, rems[rems.length - 2]);
                    let date = new Date();
                    let year = date.getFullYear();
                    let month = date.getMonth() + 1;
                    let day = date.getDate();
                    let newFileName = `favorites_${year}_${month}_${day}.html`;
                    let fileUrl = `${this.config.favoriteDir}/${newFileName}`;
                    fs.writeFileSync(fileUrl, buf);
                    console.log(`${newFileName}:写入成功!!!`);
                });
                res.end();
            }
            else {
                url = path.join(this.config.webDir, url);
                fs.readFile(url, (err, data) => {
                    if (err) {
                        res.writeHead(404, {
                            'content-type': 'text/html;charset="utf-8"'
                        });
                        res.write('<h1>404错误</h1><p>你要找的页面不存在</p>');
                        res.end();
                    }
                    else {
                        if (path.extname(url) == ".js") {
                            res.writeHead(200, {
                                'content-type': 'application/x-javascript;charset="utf-8"'
                            });
                        }
                        res.write(data); //将index.html显示在客户端
                        res.end();
                    }
                });
            }
            // let pathName = urlParase.pathname
            // console.log(request.url)
            // response.setHeader('Content-Type', 'text/plain');
            // response.end("hello nodejs");
        });
        this.server.listen(this.config.webListen, () => {
            console.log(`网页运行:${this.hostName}:${this.config.webListen}`);
        });
    }
}
exports.FavoriteServe = FavoriteServe;
