import { ConfigPlugin } from "@expo/config-plugins";
import { WidgetProviderInfoParams } from "./types";
declare const withGlance: ConfigPlugin<{
    widgetProviderInfo?: WidgetProviderInfoParams;
}>;
export default withGlance;
