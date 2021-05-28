import React from 'react';
import { Animated, Easing, Text } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmSpinnerProps from './spinner.props';
import { DEFAULT_CLASS, DEFAULT_STYLES } from './spinner.styles';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import WmPicture from '@wavemaker/app-rn-runtime/components/basic/picture/picture.component';

export default class WmSpinner extends BaseComponent<WmSpinnerProps, BaseComponentState<WmSpinnerProps>> {

  constructor(props: WmSpinnerProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmSpinnerProps());
  }
  componentDidMount() {
    this.spin();
  }

  spinValue = new Animated.Value(0);

  private spin () {
    this.spinValue.setValue(0);
    Animated.timing(
      this.spinValue,
      {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true
      }
    ).start(() => this.spin());
  };

  private prepareIcon(props: any) {
    return (<WmIcon
      styles={this.styles.icon} name={props.name + '_icon'}
      themeToUse={props.themeToUse} iconclass={props.iconclass + ' fa-spin'} iconsize={props.iconsize}></WmIcon>);
  }

  private prepareImage(props: any) {
    return (<WmPicture
      styles={{height:props.imageheight, width:props.imagewidth}} name={props.name + '_image'}
      themeToUse={props.themeToUse} picturesource={props.image}></WmPicture>);
  }

  render() {
    super.render();
    const props = this.state.props;
    const rotate = this.spinValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg']});

    return props.show ? (
      <Text style={this.styles.root}>
        <Animated.View style={{ transform: [{ rotate }] }}>
          {props.type === 'icon' && this.prepareIcon(props)}
          {props.type === 'image' && this.prepareImage(props)}
        </Animated.View>
        <Text style={this.styles.text}>{props.caption}</Text>
      </Text>
    ): null;
  }
}
