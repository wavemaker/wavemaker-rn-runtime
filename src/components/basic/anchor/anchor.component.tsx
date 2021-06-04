import React from 'react';
import { Text, View } from 'react-native';
import { Badge } from 'react-native-paper';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import { encodeUrl } from '@wavemaker/app-rn-runtime/core/utils';
import NavigationService, { NavigationServiceConsumer } from '@wavemaker/app-rn-runtime/core/navigation.service';

import WmAnchorProps from './anchor.props';
import { DEFAULT_CLASS, DEFAULT_STYLES } from './anchor.styles';

declare const window: any;

export default class WmAnchor extends BaseComponent<WmAnchorProps, BaseComponentState<WmAnchorProps>> {

  constructor(props: WmAnchorProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmAnchorProps());
  }

  onTap(navigationService: NavigationService) {
    const props = this.state.props;
    if (props.hyperlink) {
      const link = props.encodeurl ? encodeUrl(props.hyperlink) : props.hyperlink;
      navigationService.openUrl(link);
    }
    this.invokeEventCallback('onTap', [null, this.proxy]);
  }

  render() {
    super.render();
    const props = this.state.props;
    const icon = (<WmIcon
      styles={this.styles.icon} name={props.name + '_icon'}
      themeToUse={props.themeToUse} iconclass={props.iconclass}></WmIcon>);
    //@ts-ignore
    const badge = (<Badge style={this.styles.badge}>{props.badgevalue}</Badge>);
    return props.show ? (
      <NavigationServiceConsumer>
        {(navigationService: NavigationService) =>
          (<Tappable
            onTap={() => this.onTap(navigationService)}
            onDoubleTap={() => this.invokeEventCallback('onDoubletap', [null, this.proxy])}>
              <View style={[this.styles.root, {flexDirection: props.iconposition === 'top' ? 'column': 'row'}]}>
                {props.iconposition === 'top' && icon}
                {props.iconposition === 'left' && icon}
                <Text style={this.styles.text}>{props.caption}</Text>
                {props.iconposition === 'right' && icon}
                {props.badgevalue && badge}
              </View>
          </Tappable>)
      }
      </NavigationServiceConsumer>
    ): null;
  }
}
