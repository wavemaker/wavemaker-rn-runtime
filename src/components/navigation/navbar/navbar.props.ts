import { BaseNavProps } from '@wavemaker/app-rn-runtime/components/navigation/basenav/basenav.props';
import { SyntheticEvent } from "@wavemaker/app-rn-runtime/core/tappable.component";
import {
  NavigationDataItem
} from "@wavemaker/app-rn-runtime/components/navigation/basenav/basenav.component";

export default class WmNavbarProps extends BaseNavProps {
  type: string = 'pills';
  layout: string = '';
  children?: any = [] as any;
  indent = 0;
  onSelect? = ($event: SyntheticEvent, target: any, $item: NavigationDataItem) => {};  ischildnav? = false;
}
