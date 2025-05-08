"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withWidgetProviderInfo = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const withWidgetProviderInfo = (config, params) => {
    return (0, config_plugins_1.withDangerousMod)(config, [
        "android",
        async (config) => {
            const { fileName, ...widgetProviderInfo } = params;
            // Base Path
            const platformProjectRoot = config.modRequest.platformProjectRoot;
            // Path to the xml Directory
            const xmlDir = path_1.default.join(platformProjectRoot, "app", "src", "main", "res", "xml");
            // create the xml directory if it doesn't exist
            if (!fs_1.default.existsSync(xmlDir)) {
                fs_1.default.mkdirSync(xmlDir, { recursive: true });
            }
            // file content
            const attributes = Object.entries(widgetProviderInfo)
                .filter(([_, value]) => value != null && value !== "")
                .map(([key, value]) => `android:${key}="${value}"`);
            const xmlContent = `<?xml version="1.0" encoding="utf-8"?>
<appwidget-provider xmlns:android="http://schemas.android.com/apk/res/android"
    ${attributes.join("\n    ")} />`;
            const xmlPath = path_1.default.join(xmlDir, `${fileName}.xml`);
            fs_1.default.writeFileSync(xmlPath, xmlContent);
            return config;
        },
    ]);
};
exports.withWidgetProviderInfo = withWidgetProviderInfo;
