import {
  ConfigPlugin,
  withDangerousMod,
  withStringsXml,
} from "@expo/config-plugins";
import fs from "fs";
import path from "path";
import { WidgetProviderInfoParams } from "./types";
import { toSnakeCase } from "./utils";

export const withWidgetProviderInfo: ConfigPlugin<{
  widgetName: string;
  widgetProviderInfo: WidgetProviderInfoParams;
}> = (config, { widgetProviderInfo, widgetName }) => {
  const rawDescription = widgetProviderInfo.description?.trim();
  const generatedKey = rawDescription
    ?.toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^\w]/g, "");

  withStringsXml(config, (config) => {
    const finalKey = `${generatedKey}_description`;
    if (finalKey) {
      const key = finalKey;
      const value = rawDescription ?? "Widget";
      const strings = config.modResults.resources.string;
      const existing = (strings ?? []).find((s) => s.$.name === key);
      if (existing) {
        console.log(`🔁 Updating existing string: ${key}`);
        existing._ = value;
      } else {
        console.log(`🆕 Adding new string: ${key}`);
        config.modResults.resources.string ??= [];
        config.modResults.resources.string.push({
          $: { name: key },
          _: value,
        });
      }
    }

    return config;
  });
  return withDangerousMod(config, [
    "android",
    async (config) => {
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
        .map(([key, value]) => {
          if (key === "description") {
            return `android:${key}="@string/${generatedKey}_description"`;
          }
          return `android:${key}="${value}"`;
        });

      const xmlContent = `<?xml version="1.0" encoding="utf-8"?>
<appwidget-provider xmlns:android="http://schemas.android.com/apk/res/android"
    ${attributes.join("\n    ")} />`;

      // write the xml file
      const xmlPath = path.join(xmlDir, `${toSnakeCase(widgetName)}_info.xml`);
      fs.writeFileSync(xmlPath, xmlContent);

      return config;
    },
  ]);
};
