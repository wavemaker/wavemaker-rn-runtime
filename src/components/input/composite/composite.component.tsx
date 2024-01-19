import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmCompositeProps from './composite.props';
import { DEFAULT_CLASS, WmCompositeStyles } from './composite.styles';

export class WmCompositeState extends BaseComponentState<WmCompositeProps> {};

const POSITION_STYLES = {
  'top': 'app-composite-top-caption',
  'left': 'app-composite-left-caption',
  'right': 'app-composite-right-caption'
};

export default class WmComposite extends BaseComponent<WmCompositeProps, WmCompositeState, WmCompositeStyles> {

  constructor(props: WmCompositeProps) {
    super(props, DEFAULT_CLASS, new WmCompositeProps());
  }

  renderWidget(props: WmCompositeProps) {
    const styles = this.theme.mergeStyle({}, 
      this.styles,
      props.captionposition ? this.theme.getStyle(POSITION_STYLES[props.captionposition]) : {}
    );
    return (<View style={styles.root}>{this._background}{props.children}</View>); 
  }
}
