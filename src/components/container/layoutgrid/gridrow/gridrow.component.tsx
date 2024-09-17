import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmGridrowProps from './gridrow.props';
import { DEFAULT_CLASS, WmGridRowStyles } from './gridrow.styles';
import { WmSkeletonStyles } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.styles';

export class WmGridrowState extends BaseComponentState<WmGridrowProps> {

}

export default class WmGridrow extends BaseComponent<WmGridrowProps, WmGridrowState, WmGridRowStyles> {

  constructor(props: WmGridrowProps) {
    super(props, DEFAULT_CLASS, new WmGridrowProps());
  }

  renderWidget(props: WmGridrowProps) {
    const styles = this._showSkeleton ?  {
      ...this.styles.root,
      ...this.styles.skeleton.root
    } : this.styles.root

    return (
      <View style={styles}>{this._background}{props.children}</View>
    ); 
  }
}
