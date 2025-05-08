"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const withDependencies_1 = require("./withDependencies");
const withWidgetCodeSync_1 = require("./withWidgetCodeSync");
const withWidgetManifest_1 = require("./withWidgetManifest");
const withWidgetProviderInfo_1 = require("./withWidgetProviderInfo");
const withGlance = (config, { widgetProviderInfo }) => {
    return (0, config_plugins_1.withPlugins)(config, [
        withDependencies_1.withDependencies,
        [withWidgetProviderInfo_1.withWidgetProviderInfo, widgetProviderInfo],
        withWidgetCodeSync_1.withWidgetCodeSync,
        [withWidgetManifest_1.withWidgetManifest, { widgetInfoXml: widgetProviderInfo.fileName }],
    ]);
};
exports.default = withGlance;
