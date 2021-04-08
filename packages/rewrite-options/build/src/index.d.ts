import { PluginImpl } from "rollup";
export interface Options {
    url?: String;
    dir?: String | any;
}
declare const plugin: PluginImpl<Options>;
export default plugin;
