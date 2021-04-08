import * as path from "path";
import request from "request";
import rewriteCfg from "./rewriteCfg.js";
import chalk from "chalk";
const dirname = path.resolve();
export async function http(url) {
    return new Promise((resolve, reject) => {
        request.get(url, {
            timeout: 5000,
            json: true,
            headers: {
                "content-type": "application/json",
            },
        }, (error, response, body) => {
            if (error)
                reject(error);
            resolve(body);
        });
    });
}
export default function rewriteOptions(options) {
    const { url = "http://devops.aimango.net/api/apis/config/?apiKey=KgXnXfIV&app=flowweb&env=dev&noPrefix=1&format=json", dir = "./config/index.js", } = options;
    http(url)
        .then((res) => {
        /*
          返回数据 res 格式为json
          eg:{
            a:'xxx',
            b:'xxx
          }
        */
        rewriteCfg(path.resolve(dirname, dir), res);
    })
        .catch((e) => {
        console.log(chalk.red("请求 " + url + " 发生错误！"));
    });
}
