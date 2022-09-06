import mediaQuery from "css-mediaquery";
import { Dimensions } from "react-native";
import viewport from "@wavemaker/app-rn-runtime/core/viewport";

export default class MediaQueryList /* extends MediaQueryList */ {

  constructor(private query: string) {}

  public get matches(): boolean {
    const windowDimensions = Dimensions.get("window");
    return mediaQuery.match(this.query, {
      type: "screen",
      orientation: viewport.orientation,
      ...windowDimensions,
      "device-width": viewport.width,
      "device-height": viewport.height,
    } as any);
  }
}