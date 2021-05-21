import React from 'react';
import { Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { BaseComponent } from '@wavemaker/app-rn-runtime/core/base.component';

import WmIconProps from './icon.props';
import { DEFAULT_CLASS, DEFAULT_STYLES } from './icon.styles';

interface IconDef {
  isFontAwesome: boolean;
  type: string;
  rotate: string,
  size: number
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

export default class WmIcon extends BaseComponent<WmIconProps> {
  private cache = new Map<string, IconDef>();

  constructor(props: WmIconProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmIconProps());
  }

  getIconDef(iconClass: string): IconDef {
    if (this.cache.has(iconClass)) {
      return this.cache.get(iconClass) || {} as IconDef;
    }
    const iconDef = {
      rotate: '0'
    } as IconDef;
    const splits = iconClass.split(' ');
    iconDef.isFontAwesome = !!splits.find(v => v === 'fa');
    iconDef.type = splits.find(v => v.startsWith('fa-'))?.substr(3) || '';
    iconDef.size = splits.map(v => ICON_SIZES.get(v)).find(v => !!v) || 12;
    iconDef.rotate = splits.map(v => ICON_ROTATTION.get(v)).find(v => !!v) || '0deg';
    this.cache.set(iconClass, iconDef);
    return iconDef;
  }

  render() {
    super.render();
    const props = this.state.props;
    const iconDef = this.getIconDef(props.iconclass);
    let icon = null;
    if (props.show && iconDef.isFontAwesome) {
      //@ts-ignore type information is not matching
      icon = (<FontAwesome name={iconDef.type} 
        style={{transform: [{rotate: iconDef.rotate}]}} 
        size={props.iconsize || iconDef.size}/>);
    }
    return props.show ? (
      <View style={this.styles.root}>
        {props.iconposition === 'left' && icon}
        <Text style={this.styles.text}>{props.caption}</Text>
        {props.iconposition === 'right' && icon}
      </View>
    ): null; 
  }
}
