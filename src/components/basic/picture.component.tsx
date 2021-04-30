import React from 'react';
import { StyleSheet, Text, Image } from 'react-native';
import { BaseComponent, BaseProps } from '../../core/base.component';

interface WmPictureProps extends BaseProps {
  picturesource: string;
}

const DEFAULT_CLASS = 'app-label';

const DEFAULT_STYLES = StyleSheet.create({
  picture: {}
});

export default class WmPicture extends BaseComponent<WmPictureProps> {
  constructor(props: WmPictureProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES);
  }

  render() {
    super.render();
    const props = this.state.props;
    return <Image style={this.styles.picture} source={{
      uri: props.picturesource,
    }}/>;
  }
}
