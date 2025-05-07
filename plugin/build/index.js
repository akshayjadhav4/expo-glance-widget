"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const withDependencies_1 = require("./withDependencies");
const withWidgetProviderInfo_1 = require("./withWidgetProviderInfo");
const withGlance = (config, { widgetProviderInfo }) => {
    return (0, config_plugins_1.withPlugins)(config, [
        withDependencies_1.withDependencies,
        [withWidgetProviderInfo_1.withWidgetProviderInfo, widgetProviderInfo],
    ]);
};
exports.default = withGlance;
