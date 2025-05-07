import { ConfigPlugin, withPlugins } from "@expo/config-plugins";
import { WidgetProviderInfoParams } from "./types";
import { withDependencies } from "./withDependencies";
import { withWidgetProviderInfo } from "./withWidgetProviderInfo";

const withGlance: ConfigPlugin<{
  widgetProviderInfo?: WidgetProviderInfoParams;
}> = (config, { widgetProviderInfo }) => {
  return withPlugins(config, [
    withDependencies,
    [withWidgetProviderInfo, widgetProviderInfo],
  ]);
};

export default withGlance;
