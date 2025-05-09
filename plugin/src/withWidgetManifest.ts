import {
  AndroidConfig,
  ConfigPlugin,
  withAndroidManifest,
} from "@expo/config-plugins";
import fs from "fs";
import path from "path";
import { toSnakeCase } from "./utils";

function getReceiverClassNames(widgetDir: string): string[] {
  const files = fs
    .readdirSync(widgetDir)
    .filter((f) => f.endsWith("Receiver.kt"));
  const receiverRegex = /class\s+(\w+Receiver)\s*:/;

  return files.map((file) => {
    const content = fs.readFileSync(path.join(widgetDir, file), "utf-8");
    const match = receiverRegex.exec(content);
    return match?.[1] ?? path.basename(file, ".kt");
  });
}

export const withWidgetManifest: ConfigPlugin = (config) => {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults;
    const app = AndroidConfig.Manifest.getMainApplication(manifest);

    if (!app)
      throw new Error("Main <application> not found in AndroidManifest.xml");

    const widgetDir = path.join(config.modRequest.projectRoot, "widgets");
    const receiverClasses = getReceiverClassNames(widgetDir);

    if (!receiverClasses.length) {
      throw new Error("No Receiver classes found in widgets/ directory");
    }

    app.receiver = app.receiver || [];

    receiverClasses.forEach((receiverClass) => {
      // Compute resourcePath dynamically based on receiverClass
      const resourcePath = `@xml/${toSnakeCase(receiverClass.replace(/Receiver$/, ""))}_info`;
      const androidName = `.widgets.${receiverClass}`;
      const alreadyExists = app.receiver!.some(
        (r) => r.$["android:name"] === androidName
      );

      if (!alreadyExists) {
        app.receiver!.push({
          $: {
            "android:name": androidName,
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
    });

    return config;
  });
};
