import nodeRequest from "./nodeRequest.js";
import { PluginImpl } from "rollup";

export interface Options {
  url?: String;
  dir?: String | any;
}

const plugin: PluginImpl<Options> = (options = {}) => {
  return {
    name: "rewrite-options",
    writeBundle() {
      nodeRequest(options);
    },
  };
};

export default plugin;
