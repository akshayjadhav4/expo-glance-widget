import { ConfigPlugin, withDangerousMod } from "@expo/config-plugins";
import fs from "fs";
import path from "path";

const WIDGET_SRC = "widgets";
const FILES = [
  {
    name: "MyAppWidget.kt",
    template: (pkg: string) => `package ${pkg}.${WIDGET_SRC}

import android.content.Context
import androidx.compose.ui.unit.dp
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.GlanceTheme

import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.components.Scaffold
import androidx.glance.appwidget.provideContent
import androidx.glance.layout.padding
import androidx.glance.text.Text
import androidx.glance.text.TextStyle

class MyAppWidget : GlanceAppWidget() {

    override suspend fun provideGlance(context: Context, id: GlanceId) {

        // In this method, load data needed to render the AppWidget.
        // Use withContext to switch to another thread for long running
        // operations.

        provideContent {
            GlanceTheme {
                Scaffold(backgroundColor = GlanceTheme.colors.widgetBackground, modifier = GlanceModifier.padding(16.dp)){
                    Text("Hello Widget", style = TextStyle(color = GlanceTheme.colors.onSurface))
                }
            }
        }
    }
}
`,
  },
  {
    name: "MyAppWidgetReceiver.kt",
    template: (pkg: string) => `package ${pkg}.${WIDGET_SRC}

import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.GlanceAppWidgetReceiver

class MyAppWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = MyAppWidget()
}
`,
  },
];

export const withWidgetCodeSync: ConfigPlugin = (config) => {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      // Base Path of android project
      const platformProjectRoot = config.modRequest.platformProjectRoot;
      // Base Path of the project
      const projectRoot = config.modRequest.projectRoot;

      // Path to the main Directory
      const mainDir = path.join(platformProjectRoot, "app", "src", "main");
      // Path to the java Directory
      const javaDir = path.join(mainDir, "java");

      const packageName = config?.android?.package;
      if (!packageName) {
        throw new Error(
          "Could not find package name. Please set the package name in your app.json or app.config.js file."
        );
      }
      const widgetPkgPath = path.join(
        javaDir,
        ...packageName.split("."),
        WIDGET_SRC
      );

      // create the widgets package if it doesn't exist inside android project
      if (!fs.existsSync(widgetPkgPath)) {
        fs.mkdirSync(widgetPkgPath, { recursive: true });
      }

      // create the widgets/ folder if it doesn't exist at project root
      const widgetSrcPath = path.join(projectRoot, WIDGET_SRC);
      if (!fs.existsSync(widgetSrcPath))
        fs.mkdirSync(widgetSrcPath, { recursive: true });

      // create starter files in widgets/ if not already present
      for (const file of FILES) {
        const widgetFilePath = path.join(widgetSrcPath, file.name);
        if (!fs.existsSync(widgetFilePath)) {
          fs.writeFileSync(widgetFilePath, file.template(packageName));
        }
      }

      // copy files from widgets/ into Android package, always overwrite
      for (const file of FILES) {
        const srcPath = path.join(widgetSrcPath, file.name);
        const destPath = path.join(widgetPkgPath, file.name);
        const content = fs.readFileSync(srcPath, "utf-8");
        fs.writeFileSync(destPath, content);
      }

      return config;
    },
  ]);
};
