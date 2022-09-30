import React from 'react';
import { Text, View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmSpinnerProps from './spinner.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmSpinnerStyles } from './spinner.styles';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import WmPicture from '@wavemaker/app-rn-runtime/components/basic/picture/picture.component';

export class WmSpinnerState extends BaseComponentState<WmSpinnerProps> {

}

export default class WmSpinner extends BaseComponent<WmSpinnerProps, WmSpinnerState, WmSpinnerStyles> {

  constructor(props: WmSpinnerProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmSpinnerProps());
  }

  private prepareIcon(props: any) {
    return (<WmIcon
      styles={this.styles.icon}
      iconclass={props.iconclass + ' fa-spin'} iconsize={props.iconsize}></WmIcon>);
  }

  private prepareImage(props: any) {
    return (<WmPicture
        styles={this.styles.image}
        picturesource={props.image}></WmPicture>);
  }

  renderWidget(props: WmSpinnerProps) {
    return (
      <View style={this.styles.root}>
          {!props.image && this.prepareIcon(props)}
          {props.image && this.prepareImage(props)}
          {props.caption ? <Text style={this.styles.text}>{props.caption}</Text> : null}
      </View>
    );
  }
}
