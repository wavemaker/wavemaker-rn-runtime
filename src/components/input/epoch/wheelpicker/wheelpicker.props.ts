import { BaseProps } from "@wavemaker/app-rn-runtime/core/base.component";
import { PixelRatio } from "react-native";

export const defaultItemHeight = PixelRatio.roundToNearestPixel(50);

export default class WmWheelPickerProps extends BaseProps {
  data: Array<string | number> = [];
  wrapperHeight: number = PixelRatio.roundToNearestPixel(150);
  itemHeight: number = defaultItemHeight;
  selectedIndex: number = 0;
  onValueChange?: (value: string | number, index: number) => void;
}
