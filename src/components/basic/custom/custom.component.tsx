import React from 'react';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmCustomProps from './custom.props';
import { DEFAULT_CLASS, WmCustomStyles } from './custom.styles';
import { DimensionValue, Text, View } from 'react-native';
import { createSkeleton } from '../skeleton/skeleton.component';


export class WmCustomState extends BaseComponentState<WmCustomProps> { }

export default class WmCustom extends BaseComponent<WmCustomProps, WmCustomState, WmCustomStyles> {

  constructor(props: WmCustomProps) {
    super(props, DEFAULT_CLASS, new WmCustomProps(), new WmCustomState());
  }

  public renderSkeleton(prop: WmCustomProps) {
    return createSkeleton(this.theme, this.styles.skeleton, {
      ...this.styles.root,
      width: (this.props.skeletonwidth || this.styles.root.width) as DimensionValue,
      height: (this.props.skeletonheight || this.styles.root.height) as DimensionValue
    });
  }

  renderWidget(props: WmCustomProps) {
    return (
      <View style={this.styles.root}>
        {props.renderview(props)}
      </View>
    );
  }
}
