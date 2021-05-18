import React from 'react';
import { Image } from 'react-native';
import { BaseComponent } from '@wavemaker/rn-runtime/core/base.component';

import WmPictureProps from './picture.props';
import { DEFAULT_CLASS, DEFAULT_STYLES } from './picture.styles';

export default class WmPicture extends BaseComponent<WmPictureProps> {

  constructor(props: WmPictureProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmPictureProps());
  }

  render() {
    super.render();
    const props = this.state.props;
    return props.show ? (
      <Image style={this.styles.root} source={{
        uri: props.picturesource,
      }}/>
    ): null; 
  }
}
