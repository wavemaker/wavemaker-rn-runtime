import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';
import React from 'react';
import { AccessibilityRole } from 'react-native';

export default class WmPopoverProps extends BaseProps {
  animation?: string = null as any;
  badgevalue? = null as any;
  caption? = 'Link';
  contentanimation?: string = null as any;
  iconclass? = null as any;
  iconposition? = 'left' as any;
  popoverwidth?: string | number | null = 240;
  popoverheight?: string | number | null = 360;
  autoclose?: 'outsideClick' | 'disabled' | 'always' = 'outsideClick';
  children? = [] as any;
  renderPartial?: Function = null as any;
  title?: string = null as any;
  type?: 'action-sheet' | 'dropdown' = 'action-sheet';
  accessibilitylabel?: string = undefined;
  hint?: string = undefined;
  accessibilityrole?: AccessibilityRole = "none";
}
