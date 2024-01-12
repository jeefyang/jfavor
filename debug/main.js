"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const serve_1 = require("./serve");
var args = process.argv;
if (args.length < 3) {
    console.log("参数不足");
}
let file = args[2];
if (!fs.existsSync(file)) {
    console.log("没有找到配置文件");
}
else {
    let str = fs.readFileSync(file, { encoding: "utf-8" });
    let obj = eval("(" + str + ")");
    console.log(obj);
    new serve_1.FavoriteServe(obj);
}
