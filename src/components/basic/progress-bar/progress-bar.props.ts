import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';
import { AccessibilityRole } from 'react-native';
export default class WmProgressBarProps extends BaseProps {
  type: 'default' | 'success' | 'info' | 'warning' | 'error' = 'default';
  datavalue: number = 30;
  minvalue: number = 0;
  maxvalue: number = 100;
  accessibilitylabel?: string = undefined;
  accessibilityrole?: AccessibilityRole = 'progressbar';
  showtooltip?: boolean = false;
  tooltipposition?: 'up' | 'down' | 'left' | 'right' = 'up';
  onTooltiptext?: Function | null = null;
}