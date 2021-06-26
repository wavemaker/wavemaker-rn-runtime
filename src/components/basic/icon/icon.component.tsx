import React from 'react';
import { Animated, Easing, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmIconProps from './icon.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmIconStyles } from './icon.styles';
import getWavIcon from './wavicon.component';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';

interface IconDef {
  isFontAwesome: boolean;
  isWavIcon: boolean;
  type: string;
  rotate: string;
  size: number;
  animation: string;
}

const ICON_SIZES = new Map([
  ['fa-lg', 16],
  ['fa-2x', 32],
  ['fa-3x', 48],
  ['fa-4x', 64],
  ['fa-5x', 72]
]);

const ICON_ROTATTION = new Map([
  ['fa-rotate-90', '90deg'],
  ['fa-rotate-180', '180deg'],
  ['fa-rotate-270', '270deg']
]);

export class WmIconState extends BaseComponentState<WmIconProps> {
  public iconDef = {} as IconDef;
}

export default class WmIcon extends BaseComponent<WmIconProps, WmIconState, WmIconStyles> {
  spinValue = new Animated.Value(0);
  pulseValue = new Animated.Value(0);

  constructor(props: WmIconProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmIconProps());
  }

  getIconDef(iconClass: string): IconDef {
    const iconDef = {
      rotate: '0'
    } as IconDef;
    const splits = iconClass.split(' ');
    iconDef.isFontAwesome = !!splits.find(v => v === 'fa');
    if (iconDef.isFontAwesome) {
      iconDef.type = splits.find(v => v.startsWith('fa-'))?.substr(3) || '';
    } else {
      iconDef.isWavIcon = !iconDef.isFontAwesome && !!splits.find(v => v === 'wi');
      iconDef.type = (iconDef.isWavIcon && splits.find(v => v.startsWith('wi-'))?.substr(3)) || '';
    }
    if (iconClass.indexOf('fa-spin') >= 0) {
      iconDef.animation = 'spin';
    } else if (iconClass.indexOf('fa-pulse') >= 0) {
      iconDef.animation = 'pulse';
    }
    iconDef.size = splits.map(v => ICON_SIZES.get(v)).find(v => !!v) || 12;
    iconDef.rotate = splits.map(v => ICON_ROTATTION.get(v)).find(v => !!v) || '0deg';
    return iconDef;
  }

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
  }

  componentDidMount() {
    super.componentDidMount();
    this.spin();
  }

  onPropertyChange(name: string, $new: any, $old: any) {
    super.onPropertyChange(name, $new, $old);
    switch(name) {
      case 'iconclass': 
        $new && this.updateState({iconDef: this.getIconDef($new)} as WmIconState);
        break;
    }
  }
  
  renderIcon(props: WmIconProps) {
    const iconDef = this.state.iconDef;
    if (!iconDef) {
      return null;
    }
    let icon = null;
    const style = [{
      fontSize: this.styles.text.fontSize,
      color: this.styles.text.color
    }, this.styles.icon, {transform: [{rotate: iconDef.rotate}]}];
    if (props.show && iconDef && iconDef.isFontAwesome) {
      //@ts-ignore type information is not matching
      icon = (<FontAwesome name={iconDef.type}
        style={style} 
        size={props.iconsize || iconDef.size}/>);
    }
    if (props.show && iconDef && iconDef.isWavIcon) {
      const WavIcon = getWavIcon();
      //@ts-ignore type information is not matching
      icon = (<WavIcon name={iconDef.type} 
        style={style} 
        size={props.iconsize || iconDef.size}/>);
    }
    if (icon && iconDef.animation === 'spin') {
      const rotate = this.spinValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg']});
      const animation = { transform: [{ rotate }] };
      return (<Animated.View style={animation}>{icon}</Animated.View>);
    } else if (icon && iconDef.animation === 'pulse') {
      const opacity = this.spinValue.interpolate({ inputRange: [0, 1], outputRange: [0, 1]});
      const animation = { opacity: opacity };
      return (<Animated.View style={animation}>{icon}</Animated.View>);
    }
    return icon;
  }

  renderWidget(props: WmIconProps) {
    let icon = this.renderIcon(props);
    return (
      <Tappable target={this}>
        <View style={this.styles.root}>
          {(props.iconposition === 'left' && icon) || null}
          <Text style={this.styles.text}>{props.caption}</Text>
          {(props.iconposition === 'right' && icon) || null}
        </View>
      </Tappable>
    ); 
  }
}
