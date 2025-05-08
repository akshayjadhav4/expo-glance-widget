import { ConfigPlugin, withDangerousMod } from "@expo/config-plugins";
import fs from "fs";
import path from "path";
import { WidgetProviderInfoParams } from "./types";

export const withWidgetProviderInfo: ConfigPlugin<WidgetProviderInfoParams> = (
  config,
  params
) => {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const { fileName, ...widgetProviderInfo } = params;
      // Base Path
      const platformProjectRoot = config.modRequest.platformProjectRoot;

      // Path to the xml Directory
      const xmlDir = path.join(
        platformProjectRoot,
        "app",
        "src",
        "main",
        "res",
        "xml"
      );

      // create the xml directory if it doesn't exist
      if (!fs.existsSync(xmlDir)) {
        fs.mkdirSync(xmlDir, { recursive: true });
      }

      // file content
      const attributes = Object.entries(widgetProviderInfo)
        .filter(([_, value]) => value != null && value !== "")
        .map(([key, value]) => `android:${key}="${value}"`);

      const xmlContent = `<?xml version="1.0" encoding="utf-8"?>
<appwidget-provider xmlns:android="http://schemas.android.com/apk/res/android"
    ${attributes.join("\n    ")} />`;

      // write the xml file
      const xmlPath = path.join(xmlDir, `${fileName}.xml`);
      fs.writeFileSync(xmlPath, xmlContent);

      return config;
    },
  ]);
};
