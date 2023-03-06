import React from 'react';
import { Text, View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import { Badge } from 'react-native-paper';

import WmButtonProps from './button.props';
import { DEFAULT_CLASS, WmButtonStyles } from './button.styles';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import { Animatedview } from '@wavemaker/app-rn-runtime/components/basic/animatedview.component';
import WmSkeleton from '../skeleton/skeleton.component';
import { totalMonths } from 'react-native-paper-dates/lib/typescript/Date/dateUtils';

export class WmButtonState extends BaseComponentState<WmButtonProps> {

}

export default class WmButton extends BaseComponent<WmButtonProps, WmButtonState, WmButtonStyles> {

  constructor(props: WmButtonProps) {
    super(props, DEFAULT_CLASS, new WmButtonProps());
  }

  private prepareIcon(props: any) {
    return (<WmIcon
      styles={this.styles.icon} name={props.name + '_icon'} iconclass={props.iconclass} iconsize={props.iconsize}></WmIcon>);
  }

  private prepareBadge(props: any) {
    //@ts-ignore
    return (<Badge style={this.styles.badge}>{props.badgevalue}</Badge>);
  }

  public renderSkeleton(){
    return ( <WmSkeleton width={this.props.skeletonwidth || this.styles.root?.width || 96 } height={this.props.skeletonheight || this.styles.root?.height || 48} styles={ this.theme.mergeStyle(this.styles.skeleton, {root: {
      borderRadius: this.styles.root?.borderRadius || 4,
      marginTop: this.styles.root?.marginTop,
      marginBottom: this.styles.root?.marginBottom,
      marginLeft: this.styles.root?.marginLeft,
      marginRight: this.styles.root?.marginRight,
    }}) }/> );
  }

  renderWidget(props: WmButtonProps) {
    return (
      <Animatedview entryanimation={props.animation} style={this.styles.root}>
        <Tappable target={this}>
          <View style={[this.styles.content, {flexDirection: props.iconposition === 'top' ? 'column': 'row'}]}>
            {props.iconposition === 'top' && this.prepareIcon(props)}
            {props.iconposition === 'left' && this.prepareIcon(props)}
            <Text style={this.styles.text}>{props.caption}</Text>
            {props.iconposition === 'right' && this.prepareIcon(props)}
            {props.badgevalue && this.prepareBadge(props)}
          </View>
        </Tappable>
      </Animatedview>
    );
  }
}
