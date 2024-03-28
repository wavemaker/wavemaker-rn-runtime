import {BaseComponent, BaseProps} from '@wavemaker/app-rn-runtime/core/base.component';
import {NavigationDataItem} from "@wavemaker/app-rn-runtime/components/navigation/basenav/basenav.component";
import {TapEvent} from "@wavemaker/app-rn-runtime/core/tappable.component";
import { AccessibilityRole } from 'react-native';

export default class WmNavItemProps extends BaseProps {
  children?: any;
  caption?: string;
  item: any = [];
  view: 'default' | 'dropdown' | 'anchor' = 'default';
  onSelect? = ($event: TapEvent, target: any, $item: NavigationDataItem) => {};
  getDisplayExpression? = (label: string) => null as any;
  accessibilitylabel?: string = undefined;
  hint?: string = undefined;
  accessibilityrole?: AccessibilityRole = "link";
}
