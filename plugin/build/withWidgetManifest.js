"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withWidgetManifest = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function getReceiverClassName(widgetDir) {
    const files = fs_1.default.readdirSync(widgetDir);
    const receiverFile = files.find((f) => f.endsWith("Receiver.kt"));
    if (!receiverFile)
        return null;
    const content = fs_1.default.readFileSync(path_1.default.join(widgetDir, receiverFile), "utf-8");
    const receiverRegex = /class\s+(\w+Receiver)\s*:/;
    const match = receiverRegex.exec(content);
    return match?.[1] ?? path_1.default.basename(receiverFile, ".kt");
}
const withWidgetManifest = (config, props) => {
    return (0, config_plugins_1.withAndroidManifest)(config, (config) => {
        const manifest = config.modResults;
        const app = config_plugins_1.AndroidConfig.Manifest.getMainApplication(manifest);
        if (!app)
            throw new Error("Main <application> not found in AndroidManifest.xml");
        const widgetDir = path_1.default.join(config.modRequest.projectRoot, "widgets");
        const receiverClass = getReceiverClassName(widgetDir);
        if (!receiverClass) {
            throw new Error("No Receiver class found in widgets/ directory");
        }
        const resourcePath = `@xml/${props.widgetInfoXml}`;
        // avoid duplicates
        const alreadyExists = app.receiver?.some((r) => r.$["android:name"] === `.widgets.${receiverClass}`);
        if (!alreadyExists) {
            app.receiver = app.receiver || [];
            app.receiver.push({
                $: {
                    "android:name": `.widgets.${receiverClass}`,
                    "android:exported": "true",
                },
                "intent-filter": [
                    {
                        action: [
                            {
                                $: {
                                    "android:name": "android.appwidget.action.APPWIDGET_UPDATE",
                                },
                            },
                        ],
                    },
                ],
                // @ts-ignore
                "meta-data": [
                    {
                        $: {
                            "android:name": "android.appwidget.provider",
                            "android:resource": resourcePath,
                        },
                    },
                ],
            });
        }
        return config;
    });
};
exports.withWidgetManifest = withWidgetManifest;
