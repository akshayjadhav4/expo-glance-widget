"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withWidgetCodeSync = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const WIDGET_SRC = "widgets";
const FILES = [
    {
        name: "MyAppWidget.kt",
        template: (pkg) => `package ${pkg}.${WIDGET_SRC}

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
        template: (pkg) => `package ${pkg}.${WIDGET_SRC}

import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.GlanceAppWidgetReceiver

class MyAppWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = MyAppWidget()
}
`,
    },
];
const withWidgetCodeSync = (config) => {
    return (0, config_plugins_1.withDangerousMod)(config, [
        "android",
        async (config) => {
            // Base Path of android project
            const platformProjectRoot = config.modRequest.platformProjectRoot;
            // Base Path of the project
            const projectRoot = config.modRequest.projectRoot;
            // Path to the main Directory
            const mainDir = path_1.default.join(platformProjectRoot, "app", "src", "main");
            // Path to the java Directory
            const javaDir = path_1.default.join(mainDir, "java");
            const packageName = config?.android?.package;
            if (!packageName) {
                throw new Error("Could not find package name. Please set the package name in your app.json or app.config.js file.");
            }
            const widgetPkgPath = path_1.default.join(javaDir, ...packageName.split("."), WIDGET_SRC);
            // create the widgets package if it doesn't exist inside android project
            if (!fs_1.default.existsSync(widgetPkgPath)) {
                fs_1.default.mkdirSync(widgetPkgPath, { recursive: true });
            }
            // create the widgets/ folder if it doesn't exist at project root
            const widgetSrcPath = path_1.default.join(projectRoot, WIDGET_SRC);
            if (!fs_1.default.existsSync(widgetSrcPath))
                fs_1.default.mkdirSync(widgetSrcPath, { recursive: true });
            // create starter files in widgets/ if not already present
            for (const file of FILES) {
                const widgetFilePath = path_1.default.join(widgetSrcPath, file.name);
                if (!fs_1.default.existsSync(widgetFilePath)) {
                    fs_1.default.writeFileSync(widgetFilePath, file.template(packageName));
                }
            }
            // copy files from widgets/ into Android package, always overwrite
            for (const file of FILES) {
                const srcPath = path_1.default.join(widgetSrcPath, file.name);
                const destPath = path_1.default.join(widgetPkgPath, file.name);
                const content = fs_1.default.readFileSync(srcPath, "utf-8");
                fs_1.default.writeFileSync(destPath, content);
            }
            return config;
        },
    ]);
};
exports.withWidgetCodeSync = withWidgetCodeSync;
