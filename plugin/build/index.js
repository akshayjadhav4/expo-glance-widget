"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const withDependencies_1 = require("./withDependencies");
const withGlance = (config, props = {}) => {
    return (0, config_plugins_1.withPlugins)(config, [withDependencies_1.withDependencies]);
};
exports.default = withGlance;
