import { ConfigPlugin, withPlugins } from "@expo/config-plugins";
import { WidgetProviderInfoParams } from "./types";
import { withDependencies } from "./withDependencies";
import { withWidgetCodeSync } from "./withWidgetCodeSync";
import { withWidgetManifest } from "./withWidgetManifest";
import { withWidgetProviderInfo } from "./withWidgetProviderInfo";

const withGlance: ConfigPlugin<{
  widgetProviderInfo: WidgetProviderInfoParams;
}> = (config, { widgetProviderInfo }) => {
  return withPlugins(config, [
    withDependencies,
    [withWidgetProviderInfo, widgetProviderInfo],
    withWidgetCodeSync,
    [withWidgetManifest, { widgetInfoXml: widgetProviderInfo.fileName }],
  ]);
};

export default withGlance;
