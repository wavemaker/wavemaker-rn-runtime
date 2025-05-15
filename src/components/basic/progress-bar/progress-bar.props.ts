import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';
import { TooltipDirection } from '../tooltip/tooltip.props';
import { AccessibilityRole } from 'react-native';
export default class WmProgressBarProps extends BaseProps {
  type: 'default' | 'success' | 'info' | 'warning' | 'error' = 'default';
  datavalue: number = 30;
  minvalue: number = 0;
  maxvalue: number = 100;
  accessibilitylabel?: string = undefined;
  accessibilityrole?: AccessibilityRole = 'progressbar';
  showtooltip: boolean = false;
  tooltipdirection?: TooltipDirection = "up"; 
  getTooltipText?: (value: number, min: number, max: number, percentage: number) => string;
}