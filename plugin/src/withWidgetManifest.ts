import {
  AndroidConfig,
  ConfigPlugin,
  withAndroidManifest,
} from "@expo/config-plugins";
import fs from "fs";
import path from "path";
import { WidgetManifestOptions } from "./types";

function getReceiverClassName(widgetDir: string): string | null {
  const files = fs.readdirSync(widgetDir);
  const receiverFile = files.find((f) => f.endsWith("Receiver.kt"));

  if (!receiverFile) return null;

  const content = fs.readFileSync(path.join(widgetDir, receiverFile), "utf-8");
  const receiverRegex = /class\s+(\w+Receiver)\s*:/;
  const match = receiverRegex.exec(content);
  return match?.[1] ?? path.basename(receiverFile, ".kt");
}

export const withWidgetManifest: ConfigPlugin<WidgetManifestOptions> = (
  config,
  props
) => {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults;
    const app = AndroidConfig.Manifest.getMainApplication(manifest);

    if (!app)
      throw new Error("Main <application> not found in AndroidManifest.xml");

    const widgetDir = path.join(config.modRequest.projectRoot, "widgets");
    const receiverClass = getReceiverClassName(widgetDir);

    if (!receiverClass) {
      throw new Error("No Receiver class found in widgets/ directory");
    }
    const resourcePath = `@xml/${props.widgetInfoXml}`;

    // avoid duplicates
    const alreadyExists = app.receiver?.some(
      (r) => r.$["android:name"] === `.widgets.${receiverClass}`
    );

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
