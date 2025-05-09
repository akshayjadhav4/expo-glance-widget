import { ConfigPlugin, withPlugins } from "@expo/config-plugins";
import { WidgetProviderInfoParams } from "./types";
import { withDependencies } from "./withDependencies";
import withWidgetAssets from "./withWidgetAssets";
import { withWidgetCodeSync } from "./withWidgetCodeSync";
import { withWidgetManifest } from "./withWidgetManifest";
import { withWidgetProviderInfo } from "./withWidgetProviderInfo";

const withGlance: ConfigPlugin<{
  widgets: [
    {
      widgetName: string;
      widgetProviderInfo: WidgetProviderInfoParams;
    },
  ];
}> = (config, { widgets }) => {
  const applyWidgetConfigs = (currentConfig: any) => {
    return widgets.reduce((acc, widgetConfig) => {
      return withPlugins(acc, [
        [withWidgetProviderInfo, widgetConfig],
        [withWidgetCodeSync, { widgetName: widgetConfig.widgetName }],
      ]);
    }, currentConfig);
  };

  return withPlugins(config, [
    withDependencies,
    applyWidgetConfigs,
    withWidgetManifest,
    withWidgetAssets,
  ]);
};

export default withGlance;
