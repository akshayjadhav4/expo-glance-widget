import { ConfigPlugin, withPlugins } from "@expo/config-plugins";
import { withDependencies } from "./withDependencies";

const withGlance: ConfigPlugin<{ [key: string]: any }> = (
  config,
  props = {}
) => {
  return withPlugins(config, [withDependencies]);
};

export default withGlance;
