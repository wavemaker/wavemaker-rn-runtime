import React from 'react';
import { DimensionValue, View } from 'react-native';
import {
  BaseComponent,
  BaseComponentState,
} from '@wavemaker/app-rn-runtime/core/base.component';

import WmButtongroupProps from './buttongroup.props';
import { DEFAULT_CLASS, WmButtongroupStyles } from './buttongroup.styles';
import WmSkeleton, { createSkeleton } from '../skeleton/skeleton.component';

export class WmButtongroupState extends BaseComponentState<WmButtongroupProps> {}

export default class WmButtongroup extends BaseComponent<
  WmButtongroupProps,
  WmButtongroupState,
  WmButtongroupStyles
> {
  constructor(props: WmButtongroupProps) {
    super(props, DEFAULT_CLASS, new WmButtongroupProps());
  }

  public renderSkeleton(props: WmButtongroupProps) {
    return createSkeleton(this.theme, this.styles.skeleton, {
      ...this.styles.root,
      width: (this.props.skeletonwidth ||
        this.styles.root.width) as DimensionValue,
      height: (this.props.skeletonheight ||
        this.styles.root.height) as DimensionValue,
    });
  }

  renderWidget(props: WmButtongroupProps) {
    return (
      <View
        style={[
          this.styles.root,
          { flexDirection: props.vertical ? 'column' : 'row' },
        ]}
      >
        {this._background}
        {props.children}
      </View>
    );
  }
}
