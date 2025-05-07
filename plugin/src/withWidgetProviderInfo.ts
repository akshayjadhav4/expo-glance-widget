import { ConfigPlugin, withAndroidStyles } from "@expo/config-plugins";
import { WidgetProviderInfoParams } from "./types";

export const withWidgetProviderInfo: ConfigPlugin<WidgetProviderInfoParams> = (
  config,
  params
) => {
  return withAndroidStyles(config, (config) => {
    return config;
  });
};
