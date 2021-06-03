import React from 'react';
import { Text, View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import { Badge } from 'react-native-paper';

import WmButtonProps from './button.props';
import { DEFAULT_CLASS, DEFAULT_STYLES } from './button.styles';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';

export default class WmButton extends BaseComponent<WmButtonProps, BaseComponentState<WmButtonProps>> {

  constructor(props: WmButtonProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmButtonProps());
  }

  private prepareIcon(props: any) {
    return (<WmIcon
      styles={this.styles.icon} name={props.name + '_icon'}
      themeToUse={props.themeToUse} iconclass={props.iconclass}></WmIcon>);
  }

  private prepareBadge(props: any) {
    //@ts-ignore
    return (<Badge style={this.styles.badge}>{props.badgevalue}</Badge>);
  }

  render() {
    super.render();
    const props = this.state.props;
    return props.show ? (
      <Tappable
        onTap={() => this.invokeEventCallback('onTap', [null, this.proxy])}
        onDoubleTap={() => this.invokeEventCallback('onDoubletap', [null, this.proxy])}>
        <View style={[this.styles.root, {flexDirection: props.iconposition === 'top' ? 'column': 'row'}]}>
          {props.iconposition === 'top' && this.prepareIcon(props)}
          {props.iconposition === 'left' && this.prepareIcon(props)}
          <Text style={this.styles.text}>{props.caption}</Text>
          {props.iconposition === 'right' && this.prepareIcon(props)}
          {props.badgevalue && this.prepareBadge(props)}
        </View>
      </Tappable>
    ): null;
  }
}
