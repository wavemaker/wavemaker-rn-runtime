import React from 'react';
import { Image } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmPictureProps from './picture.props';
import { DEFAULT_CLASS, DEFAULT_STYLES } from './picture.styles';

export default class WmPicture extends BaseComponent<WmPictureProps, BaseComponentState<WmPictureProps>> {

  constructor(props: WmPictureProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmPictureProps());
  }

  render() {
    super.render();
    const props = this.state.props;
    return props.show ? (
      <Image style={this.styles.root} source={{
        uri: props.picturesource,
        height: this.styles.height,
        width: this.styles.width,
      }}/>
    ): null;
  }
}
