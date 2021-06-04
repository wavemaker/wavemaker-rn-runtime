import React from 'react';
import { Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmIconProps from './icon.props';
import { DEFAULT_CLASS, DEFAULT_STYLES } from './icon.styles';
import WavIcon from './wavicon.component';

interface IconDef {
  isFontAwesome: boolean;
  isWavIcon: boolean;
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

export class WmIconState extends BaseComponentState<WmIconProps> {
  public iconDef = {} as IconDef;
}

export default class WmIcon extends BaseComponent<WmIconProps, WmIconState> {

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
    iconDef.size = splits.map(v => ICON_SIZES.get(v)).find(v => !!v) || 12;
    iconDef.rotate = splits.map(v => ICON_ROTATTION.get(v)).find(v => !!v) || '0deg';
    return iconDef;
  }

  onPropertyChange(name: string, $new: any, $old: any) {
    super.onPropertyChange(name, $new, $old);
    switch(name) {
      case 'iconclass': 
        $new && this.updateState({iconDef: this.getIconDef($new)} as WmIconState);
        break;
    }
  }

  render() {
    super.render();
    const props = this.state.props;
    const iconDef = this.state.iconDef;
    let icon = null;
    if (props.show && iconDef && iconDef.isFontAwesome) {
      //@ts-ignore type information is not matching
      icon = (<FontAwesome name={iconDef.type} 
        style={[this.styles.text, this.styles.icon, {transform: [{rotate: iconDef.rotate}]}]} 
        size={props.iconsize || iconDef.size}/>);
    }
    if (props.show && iconDef && iconDef.isWavIcon) {
      //@ts-ignore type information is not matching
      icon = (<WavIcon name={iconDef.type} 
        style={[this.styles.text, this.styles.icon, {transform: [{rotate: iconDef.rotate}]}]} 
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
