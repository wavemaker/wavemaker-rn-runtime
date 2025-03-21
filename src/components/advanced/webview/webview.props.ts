import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';
import WmWebview from './webview.component';
import { AccessibilityRole } from 'react-native';

export default class WmWebviewProps extends BaseProps {
  src: string = null as any;
  incognito? = false;
  onLoad?: ($event: any, $widget: WmWebview) => void = null as any;
  accessibilitylabel?: string = undefined;
  hint?: string = undefined;
  accessibilityrole?: AccessibilityRole;
}