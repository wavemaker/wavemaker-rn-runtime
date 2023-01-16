import React from 'react';
import { Animated, Easing, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmIconProps from './icon.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmIconStyles } from './icon.styles';
import WavIcon from './wavicon/wavicon.component';
import StreamlineLightIcon from './streamline-light-icon/streamline-light-icon.component';
import StreamlineRegularIcon from './streamline-regular-icon/streamline-regular-icon.component';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import { Animatedview } from '@wavemaker/app-rn-runtime/components/basic/animatedview.component';

interface IconDef {
  isFontAwesome: boolean;
  isWavIcon: boolean;
  isStreamlineLightIcon: boolean;
  isStreamlineRegularIcon: boolean;
  type: string;
  rotate: string;
  size: number;
  animation: string;
}

const ICON_SIZES = new Map([
  ['fa-lg', 24],
  ['fa-2x', 36],
  ['fa-3x', 48],
  ['fa-4x', 60],
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
  public stopAnimation = true; 

  constructor(props: WmIconProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmIconProps());
  }

  getIconDef(iconClass: string): IconDef {
    const iconDef = {
      rotate: '0'
    } as IconDef;
    const splits = iconClass.split(' ');
    iconDef.isFontAwesome = !!splits.find(v => v === 'fa');
    iconDef.isStreamlineLightIcon = !!splits.find(v => v === 'wm-sl-l');
    iconDef.isStreamlineRegularIcon = !!splits.find(v => v === 'wm-sl-r');
    if (iconDef.isFontAwesome) {
      iconDef.type = splits.find(v => v.startsWith('fa-'))?.substring(3) || '';
    } else if (iconDef.isStreamlineLightIcon) {
      iconDef.type = splits.find(v => v.startsWith('sl-'))?.substring(3) || '';
    } else if (iconDef.isStreamlineRegularIcon) {
      iconDef.type = splits.find(v => v.startsWith('sl-'))?.substring(3) || '';
    } else {
      iconDef.isWavIcon = !iconDef.isFontAwesome && !!splits.find(v => v === 'wi');
      iconDef.type = (iconDef.isWavIcon && splits.find(v => v.startsWith('wi-'))?.substring(3)) || '';
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
    if (this.stopAnimation) {
      return;
    }
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

  componentWillUnmount(): void {
      super.componentWillUnmount();
      this.stopAnimation = true;
  }

  onPropertyChange(name: string, $new: any, $old: any) {
    super.onPropertyChange(name, $new, $old);
    switch(name) {
      case 'iconclass':
        $new && this.updateState({iconDef: this.getIconDef($new)} as WmIconState);
        break;
    }
  }

  private getCustomIcon(props: WmIconProps, style: any) {
    const customIcon = this.theme.mergeStyle({}, this.theme.getStyle(props?.iconclass || '')?.icon || this.styles.icon);
    const customIconContent = customIcon?.content;
    if (customIconContent) {
      delete customIcon.content;
      return (<Text
        style={[style, customIcon.fontFamily ? {fontFamily: customIcon.fontFamily}: null]}>
          {decodeURIComponent(customIconContent)}
      </Text>);
    }
    return null;
  }

  renderIcon(props: WmIconProps) {
    const iconDef = this.state.iconDef;
    if (!iconDef) {
      return null;
    }
    let icon = null;
    const style = [{
      color: this.styles.root.color || this.styles.text.color
    }, this.styles.icon, {transform: [{rotate: iconDef.rotate}]}];
    const customIcon = this.getCustomIcon(props, style);
    const iconSize = props.iconsize || this.styles.root.fontSize || this.styles.text.fontSize || iconDef.size;
    if (props.show && iconDef && iconDef.isFontAwesome) {
      //@ts-ignore type information is not matching
      icon = (<FontAwesome name={customIcon ? '' : iconDef.type}
        style={style}
        size={iconSize}>
          {customIcon}
        </FontAwesome>);
    } else if (props.show && iconDef) {
      let WMCustomIcon = WavIcon as unknown;
      if (iconDef.isStreamlineLightIcon) {
        WMCustomIcon = StreamlineLightIcon;
      } else if (iconDef.isStreamlineRegularIcon) {
        WMCustomIcon = StreamlineRegularIcon;
      }
      //@ts-ignore type information is not matching
      icon = WMCustomIcon ? (<WMCustomIcon name={customIcon ? '' : iconDef.type}
        style={style}
        size={iconSize}>
        {customIcon}
      </WMCustomIcon>) : null;
    }
    if (icon && iconDef.animation === 'spin') {
      const rotate = this.spinValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg']});
      const animation = { transform: [{ rotate }] };
      this.stopAnimation = false;
      return (<Animated.View style={animation}>{icon}</Animated.View>);
    } else if (icon && iconDef.animation === 'pulse') {
      const opacity = this.spinValue.interpolate({ inputRange: [0, 1], outputRange: [0, 1]});
      const animation = { opacity: opacity };
      this.stopAnimation = false;
      return (<Animated.View style={animation}>{icon}</Animated.View>);
    } else {
      this.stopAnimation = true;
    }
    return icon;
  }

  renderWidget(props: WmIconProps) {
    let icon = this.renderIcon(props);
    return (
      <Tappable target={this}>
        <Animatedview entryanimation={props.animation} style={this.styles.root}>
          {(props.iconposition === 'left' && icon) || null}
          {(props.caption && (<Text style={this.styles.text}>{props.caption}</Text>)) || null}
          {(props.iconposition === 'right' && icon) || null}
        </Animatedview>
      </Tappable>
    );
  }
}
