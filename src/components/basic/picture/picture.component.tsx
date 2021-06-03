import React from 'react';
import { Image } from 'react-native';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmPictureProps from './picture.props';
import { DEFAULT_CLASS, DEFAULT_STYLES } from './picture.styles';

export class WmPictureState extends BaseComponentState<WmPictureProps> {
  naturalImageWidth: number = 0;
  naturalImageHeight: number = 0;
}

export default class WmPicture extends BaseComponent<WmPictureProps, WmPictureState> {

  constructor(props: WmPictureProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmPictureProps());
  }

  onPropertyChange(name: string, $new: any, $old: any) {
    switch(name) {
      case 'picturesource':
        Image.getSize($new, (width: number, height: number) => {
          setTimeout(() => {
            this.updateState('naturalImageWidth', width);
            this.updateState('naturalImageHeight', height);
            this.forceUpdate();
          }, 10);
        }, () => {});
        break;
    }
  }

  compuateImageSize() {
    let imageWidth = this.styles.root.width;
    let imageHeight = this.styles.root.height;
    if (!imageWidth) {
      if (imageHeight) {
        imageWidth = imageHeight * this.state.naturalImageWidth / this.state.naturalImageHeight;
      } else {
        imageWidth = this.state.naturalImageWidth;
      }
    }
    if (!imageHeight) {
      if (imageWidth) {
        imageHeight = imageWidth * this.state.naturalImageHeight / this.state.naturalImageWidth;
      } else {
        imageHeight = this.state.naturalImageHeight;
      }
    }
    return [imageWidth, imageHeight];
  }

  render() {
    super.render();
    const props = this.state.props;
    const [imageWidth, imageHeight] = this.compuateImageSize();
    return props.show ? (
      <Tappable onTap={() => this.invokeEventCallback('onTap', [null, this.proxy])}
        onDoubleTap={() => this.invokeEventCallback('onDoubletap', [null, this.proxy])}>
        <Image style={this.styles.root} resizeMode={'stretch'} source={{
          uri: props.picturesource,
          height: imageHeight,
          width: imageWidth,
        }}/>
      </Tappable>
    ): null;
  }
}
