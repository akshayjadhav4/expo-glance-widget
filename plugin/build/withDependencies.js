"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withDependencies = void 0;
const config_plugins_1 = require("expo/config-plugins");
const GLANCE_DEPENDENCIES = [
    {
        comment: "For AppWidgets support",
        dependency: "androidx.glance:glance-appwidget:1.1.1",
    },
    {
        comment: "For interop APIs with Material 3",
        dependency: "androidx.glance:glance-material3:1.1.1",
    },
];
const withDependencies = (config) => {
    return (0, config_plugins_1.withAppBuildGradle)(config, (config) => {
        if (config.modResults.language !== "groovy") {
            config_plugins_1.WarningAggregator.addWarningAndroid("withGlance", `Cannot configure app/build.gradle if it's not groovy`);
            return config;
        }
        const { contents } = config.modResults;
        // Compose Compiler Gradle plugin
        const pluginBlock = `plugins {
        id("org.jetbrains.kotlin.plugin.compose") version "2.0.0" // this version matches your Kotlin version
}

`;
        config.modResults.contents = pluginBlock + contents;
        const updatedContents = config.modResults.contents;
        // Add Glance Dependencies
        const dependenciesBlockStartIndex = updatedContents.search(/^dependencies\s*{/m);
        // if no `dependencies {` block found
        if (dependenciesBlockStartIndex === -1) {
            config_plugins_1.WarningAggregator.addWarningAndroid("withGlance", "dependencies block start not found in app/build.gradle");
            return config;
        }
        //  get index of the closing `}`
        const IndexOfClosing = findBlockEnd(updatedContents, dependenciesBlockStartIndex);
        if (IndexOfClosing === -1) {
            config_plugins_1.WarningAggregator.addWarningAndroid("withGlance", "dependencies block end not found in app/build.gradle");
            return config;
        }
        const dependencyLines = ["    // START Glance dependency"];
        GLANCE_DEPENDENCIES.forEach((dep) => {
            if (dep.comment)
                dependencyLines.push(`    // ${dep.comment}`);
            dependencyLines.push(`    implementation "${dep.dependency}"`);
        });
        dependencyLines.push("    // END Glance dependency");
        const dependencyBlock = dependencyLines.join("\n") + "\n";
        config.modResults.contents =
            updatedContents.slice(0, IndexOfClosing) +
                dependencyBlock +
                updatedContents.slice(IndexOfClosing);
        return config;
    });
};
exports.withDependencies = withDependencies;
function findBlockEnd(contents, startIndex) {
    let openCount = 0;
    let i = startIndex;
    while (i < contents.length) {
        const char = contents[i];
        if (char === "{") {
            openCount++;
        }
        else if (char === "}") {
            openCount--;
            if (openCount === 0) {
                return i;
            }
        }
        i++;
    }
    return -1; // Not found
}
