import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmPrefabContainerProps from './prefab-container.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmPrefabContainerStyles } from './prefab-container.styles';

export class WmPrefabContainerState extends BaseComponentState<WmPrefabContainerProps> {

}

export default class WmPrefabContainer extends BaseComponent<WmPrefabContainerProps, WmPrefabContainerState, WmPrefabContainerStyles> {

  constructor(props: WmPrefabContainerProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES);
  }

  render() {
    super.render();
    const props = this.state.props;
    return (
      <View style={this.styles.root}>
        {props.children}
      </View>
    ); 
  }
}
