"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const withDependencies_1 = require("./withDependencies");
const withWidgetAssets_1 = __importDefault(require("./withWidgetAssets"));
const withWidgetCodeSync_1 = require("./withWidgetCodeSync");
const withWidgetManifest_1 = require("./withWidgetManifest");
const withWidgetProviderInfo_1 = require("./withWidgetProviderInfo");
const withGlance = (config, { widgetProviderInfo }) => {
    return (0, config_plugins_1.withPlugins)(config, [
        withDependencies_1.withDependencies,
        [withWidgetProviderInfo_1.withWidgetProviderInfo, widgetProviderInfo],
        withWidgetCodeSync_1.withWidgetCodeSync,
        [withWidgetManifest_1.withWidgetManifest, { widgetInfoXml: widgetProviderInfo.fileName }],
        withWidgetAssets_1.default,
    ]);
};
exports.default = withGlance;
