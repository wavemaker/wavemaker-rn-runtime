import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmButtongroupProps from './buttongroup.props';
import { DEFAULT_CLASS, WmButtongroupStyles } from './buttongroup.styles';
import WmSkeleton from '../skeleton/skeleton.component';

export class WmButtongroupState extends BaseComponentState<WmButtongroupProps> {}

export default class WmButtongroup extends BaseComponent<WmButtongroupProps, WmButtongroupState, WmButtongroupStyles> {

  constructor(props: WmButtongroupProps) {
    super(props, DEFAULT_CLASS, new WmButtongroupProps());
  }

  public renderSkeleton(){
    return ( <WmSkeleton width={this.props.skeletonwidth || this.styles.root?.width || "100%"} height={this.props.skeletonheight || this.styles.root?.height || 48} styles={ this.theme.mergeStyle(this.styles.skeleton, {root: {
      borderRadius: this.styles.root?.borderRadius || 4,
      marginTop: this.styles.root?.marginTop,
      marginBottom: this.styles.root?.marginBottom,
      marginLeft: this.styles.root?.marginLeft,
      marginRight: this.styles.root?.marginRight,
    }
      }) }/> );
  }

  renderWidget(props: WmButtongroupProps) {
    return (
      <View style={[this.styles.root, {flexDirection: props.vertical ? 'column': 'row'}]}>
        {props.children}
      </View>
    );
  }
}
