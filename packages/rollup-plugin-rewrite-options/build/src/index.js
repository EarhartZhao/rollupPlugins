import nodeRequest from "./nodeRequest.js";
const plugin = (options = {}) => {
    return {
        name: "rewrite-options-rewrite-options",
        writeBundle() {
            nodeRequest(options);
        },
    };
};
export default plugin;
