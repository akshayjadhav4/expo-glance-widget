import {
  ConfigPlugin,
  WarningAggregator,
  withDangerousMod,
} from "@expo/config-plugins";
import fs from "fs";
import path from "path";

const WIDGET_SRC = "widgets";
const invalidNameRegex = /[^a-z0-9_]/;

const withWidgetAssets: ConfigPlugin = (config) => {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;

      const widgetAssetsPath = path.join(projectRoot, WIDGET_SRC, "assets");
      const androidDrawablePath = path.join(
        config.modRequest.platformProjectRoot,
        "app",
        "src",
        "main",
        "res",
        "drawable"
      );

      // check widgets/assets folder exists
      if (!fs.existsSync(widgetAssetsPath)) {
        fs.mkdirSync(widgetAssetsPath, { recursive: true });
        const gitkeepPath = path.join(widgetAssetsPath, ".gitkeep");
        fs.writeFileSync(gitkeepPath, "");
        return config; // nothing else to copy yet
      }

      // check drawable path exists
      if (!fs.existsSync(androidDrawablePath)) {
        fs.mkdirSync(androidDrawablePath, { recursive: true });
      }

      const assets = fs.readdirSync(widgetAssetsPath);
      if (assets.length === 0) {
        return config;
      }

      for (const asset of assets) {
        if (asset === ".gitkeep") continue;

        const ext = path.extname(asset).toLowerCase();
        const nameWithoutExt = path.basename(asset, ext);
        const allowed = [".png", ".jpg", ".jpeg", ".webp", ".xml"];
        if (!allowed.includes(ext)) {
          WarningAggregator.addWarningAndroid(
            "withGlance",
            `⚠️ Skipping "${asset}" — unsupported file type.`
          );
          continue;
        }

        if (invalidNameRegex.test(nameWithoutExt)) {
          const suggested = nameWithoutExt
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "_");
          WarningAggregator.addWarningAndroid(
            "withGlance",
            `❌ Skipping "${asset}" — Android resource names must use only lowercase letters, digits, and underscores.
        Suggested rename: "${suggested}${ext}"`
          );
          continue;
        }

        const src = path.join(widgetAssetsPath, asset);
        const dest = path.join(androidDrawablePath, asset);
        fs.copyFileSync(src, dest);
      }

      return config;
    },
  ]);
};

export default withWidgetAssets;
