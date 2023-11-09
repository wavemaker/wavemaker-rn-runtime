import React from 'react';
import { DimensionValue, Text, View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import { Badge } from 'react-native-paper';

import WmButtonProps from './button.props';
import { DEFAULT_CLASS, WmButtonStyles } from './button.styles';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import { Animatedview } from '@wavemaker/app-rn-runtime/components/basic/animatedview.component';
import { createSkeleton } from '../skeleton/skeleton.component';

export class WmButtonState extends BaseComponentState<WmButtonProps> {

}

export default class WmButton extends BaseComponent<WmButtonProps, WmButtonState, WmButtonStyles> {

  constructor(props: WmButtonProps) {
    super(props, DEFAULT_CLASS, new WmButtonProps());
  }

  private prepareIcon(props: any) {
    return (<WmIcon
      {...this.getTestPropsForLabel('icon')}
      styles={this.styles.icon} name={props.name + '_icon'} iconclass={props.iconclass} iconsize={props.iconsize}></WmIcon>);
  }

  private prepareBadge(props: any) {
    //@ts-ignore
    return (<Badge style={this.styles.badge}>{props.badgevalue}</Badge>);
  }

  public renderSkeleton(prop: WmButtonProps) {
    return createSkeleton(this.theme, this.styles.skeleton, {
      ...this.styles.root,
      width: (this.props.skeletonwidth || this.styles.root.width)as DimensionValue,
      height: (this.props.skeletonheight || this.styles.root.height) as DimensionValue
    });
  }

  renderWidget(props: WmButtonProps) {
    return (
      <Animatedview entryanimation={props.animation} style={this.styles.root}>
        {this._background}
        <Tappable target={this} {...this.getTestPropsForAction()}>
          <View style={[this.styles.content, {flexDirection: props.iconposition === 'top' ? 'column': 'row'}]}>
            {props.iconposition === 'top' && this.prepareIcon(props)}
            {props.iconposition === 'left' && this.prepareIcon(props)}
            {props.caption ? (<Text style={this.styles.text} 
              {...this.getTestPropsForLabel('caption')}>{props.caption}</Text>): null}
            {props.iconposition === 'right' && this.prepareIcon(props)}
            {props.badgevalue && this.prepareBadge(props)}
          </View>
        </Tappable>
      </Animatedview>
    );
  }
}
