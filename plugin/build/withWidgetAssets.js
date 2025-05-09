"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const WIDGET_SRC = "widgets";
const invalidNameRegex = /[^a-z0-9_]/;
const withWidgetAssets = (config) => {
    return (0, config_plugins_1.withDangerousMod)(config, [
        "android",
        async (config) => {
            const projectRoot = config.modRequest.projectRoot;
            const widgetAssetsPath = path_1.default.join(projectRoot, WIDGET_SRC, "assets");
            const androidDrawablePath = path_1.default.join(config.modRequest.platformProjectRoot, "app", "src", "main", "res", "drawable");
            // check widgets/assets folder exists
            if (!fs_1.default.existsSync(widgetAssetsPath)) {
                fs_1.default.mkdirSync(widgetAssetsPath, { recursive: true });
                const gitkeepPath = path_1.default.join(widgetAssetsPath, ".gitkeep");
                fs_1.default.writeFileSync(gitkeepPath, "");
                return config; // nothing else to copy yet
            }
            // check drawable path exists
            if (!fs_1.default.existsSync(androidDrawablePath)) {
                fs_1.default.mkdirSync(androidDrawablePath, { recursive: true });
            }
            const assets = fs_1.default.readdirSync(widgetAssetsPath);
            if (assets.length === 0) {
                return config;
            }
            for (const asset of assets) {
                if (asset === ".gitkeep")
                    continue;
                const ext = path_1.default.extname(asset).toLowerCase();
                const nameWithoutExt = path_1.default.basename(asset, ext);
                const allowed = [".png", ".jpg", ".jpeg", ".webp", ".xml"];
                if (!allowed.includes(ext)) {
                    config_plugins_1.WarningAggregator.addWarningAndroid("withGlance", `⚠️ Skipping "${asset}" — unsupported file type.`);
                    continue;
                }
                if (invalidNameRegex.test(nameWithoutExt)) {
                    const suggested = nameWithoutExt
                        .toLowerCase()
                        .replace(/[^a-z0-9]/g, "_");
                    config_plugins_1.WarningAggregator.addWarningAndroid("withGlance", `❌ Skipping "${asset}" — Android resource names must use only lowercase letters, digits, and underscores.
        Suggested rename: "${suggested}${ext}"`);
                    continue;
                }
                const src = path_1.default.join(widgetAssetsPath, asset);
                const dest = path_1.default.join(androidDrawablePath, asset);
                fs_1.default.copyFileSync(src, dest);
            }
            return config;
        },
    ]);
};
exports.default = withWidgetAssets;
