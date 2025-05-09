import {
  ConfigPlugin,
  WarningAggregator,
  withAppBuildGradle,
} from "expo/config-plugins";
import { findBlockEnd } from "./utils";

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

export const withDependencies: ConfigPlugin = (config) => {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language !== "groovy") {
      WarningAggregator.addWarningAndroid(
        "withGlance",
        `Cannot configure app/build.gradle if it's not groovy`
      );
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
    const dependenciesBlockStartIndex =
      updatedContents.search(/^dependencies\s*{/m);
    // if no `dependencies {` block found
    if (dependenciesBlockStartIndex === -1) {
      WarningAggregator.addWarningAndroid(
        "withGlance",
        "dependencies block start not found in app/build.gradle"
      );
      return config;
    }

    //  get index of the closing `}`
    const IndexOfClosing = findBlockEnd(
      updatedContents,
      dependenciesBlockStartIndex
    );

    if (IndexOfClosing === -1) {
      WarningAggregator.addWarningAndroid(
        "withGlance",
        "dependencies block end not found in app/build.gradle"
      );
      return config;
    }

    const dependencyLines = ["    // START Glance dependency"];

    GLANCE_DEPENDENCIES.forEach((dep) => {
      if (dep.comment) dependencyLines.push(`    // ${dep.comment}`);
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
