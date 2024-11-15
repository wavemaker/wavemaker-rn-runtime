import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmCustomWidgetContainerProps from './customwidgetcontainer.props';
import { DEFAULT_CLASS, WmCustomWidgetContainerStyles } from './customwidgetcontainer.styles';

export class WmCustomWidgetContainerState extends BaseComponentState<WmCustomWidgetContainerProps> {}

export default class WmCustomWidgetContainer extends BaseComponent<WmCustomWidgetContainerProps, WmCustomWidgetContainerState, WmCustomWidgetContainerStyles> {

  constructor(props: WmCustomWidgetContainerProps) {
    super(props, DEFAULT_CLASS, new WmCustomWidgetContainerProps(), new WmCustomWidgetContainerState());
  }

  renderWidget(props: WmCustomWidgetContainerProps) {
    return (
      <>
        {props.children}
      </>
    ); 
  }
}
