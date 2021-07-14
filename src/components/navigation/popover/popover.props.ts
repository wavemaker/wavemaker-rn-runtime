import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';
import React from 'react';

export default class WmPopoverProps extends BaseProps {
  badgevalue? = null as any;
  caption? = 'Link';
  iconclass? = null as any;
  iconposition? = 'left' as any;
  popoverwidth?: string | number | null = 240;
  popoverheight?: string | number | null = 360;
  autoclose?: 'outsideClick' | 'disabled' | 'always' = 'outsideClick';
  children? = [] as any;
  renderPartial?: ()  => React.ReactNode = null as any;
  title?: string = null as any;
  type?: 'action-sheet' | 'dropdown' = 'action-sheet';
}