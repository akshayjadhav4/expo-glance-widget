"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withWidgetProviderInfo = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const withWidgetProviderInfo = (config, params) => {
    return (0, config_plugins_1.withAndroidStyles)(config, (config) => {
        const { modResults } = config;
        console.log("🚀 ~ returnwithAndroidStyles ~ modResults:", modResults?.resources);
        return config;
    });
};
exports.withWidgetProviderInfo = withWidgetProviderInfo;
