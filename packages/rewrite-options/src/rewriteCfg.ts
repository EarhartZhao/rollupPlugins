import * as fs from "fs";
import chalk from "chalk";

export default function rewriteCfg(file, newCfg) {
  try {
    fs.writeFileSync(file, "");
    fs.appendFileSync(file, "export default {\n");
    for (const item in newCfg) {
      fs.appendFileSync(file, ` ${item}: "${newCfg[item]}",\n`);
    }
    fs.appendFileSync(file, "}");
    console.log(chalk.green("[rollup-plugin-rewrite-options]:配置已写入" + file + "文件！"));
  } catch (e) {
    console.log(chalk.red("[rollup-plugin-rewrite-options]:写入配置错误，可能不存在 " + file + " 文件！"));
    return;
  }
}
