import React from 'react';
import { Image, View } from 'react-native';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmPictureProps from './picture.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmPictureStyles } from './picture.styles';

export class WmPictureState extends BaseComponentState<WmPictureProps> {
  naturalImageWidth: number = 0;
  naturalImageHeight: number = 0;
}

export default class WmPicture extends BaseComponent<WmPictureProps, WmPictureState, WmPictureStyles> {

  constructor(props: WmPictureProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmPictureProps());
  }

  onPropertyChange(name: string, $new: any, $old: any) {
    let imageSrc = '';
    switch(name) {
      case 'picturesource':
      case 'pictureplaceholder':
        imageSrc = this.state.props.picturesource || $new;
        Image.getSize(imageSrc, (width: number, height: number) => {
          this.updateState({
            naturalImageWidth: width, 
            naturalImageHeight: height
          } as WmPictureState);
        }, () => {});
        break;
    }
  }

  compuateImageSize() {
    let imageWidth = this.styles.root.width as number;
    let imageHeight = this.styles.root.height as number;
    if (!imageWidth) {
      if (imageHeight && this.state.naturalImageHeight) {
        imageWidth = imageHeight * this.state.naturalImageWidth / this.state.naturalImageHeight;
      } else {
        imageWidth = this.state.naturalImageWidth;
      }
    }
    if (!imageHeight) {
      if (imageWidth && this.state.naturalImageWidth) {
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
        <View style={[this.styles.root, {height: imageHeight, width: imageWidth}]}>
          <Image style={this.styles.picture} resizeMode={'stretch'} source={{
            uri: props.picturesource || props.pictureplaceholder}}/>
        </View>
      </Tappable>
    ): null;
  }
}
