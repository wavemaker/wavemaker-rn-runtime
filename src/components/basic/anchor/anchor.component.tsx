import React from 'react';
import { Text } from 'react-native';
import { Badge } from 'react-native-paper';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import { TapEvent, Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import { encodeUrl } from '@wavemaker/app-rn-runtime/core/utils';
import { AccessibilityWidgetType, getAccessibilityProps } from '@wavemaker/app-rn-runtime/core/accessibility';
import NavigationService, { NavigationServiceConsumer } from '@wavemaker/app-rn-runtime/core/navigation.service';

import WmAnchorProps from './anchor.props';
import { DEFAULT_CLASS, WmAnchorStyles } from './anchor.styles';
import { Animatedview } from '@wavemaker/app-rn-runtime/components/basic/animatedview.component';
import { createSkeleton } from '../skeleton/skeleton.component';

export class WmAnchorState extends BaseComponentState<WmAnchorProps> {

}

export default class WmAnchor extends BaseComponent<WmAnchorProps, WmAnchorState, WmAnchorStyles> {

  constructor(props: WmAnchorProps) {
    super(props, DEFAULT_CLASS, new WmAnchorProps());
  }

  onTap(navigationService: NavigationService, e: TapEvent) {
    const props = this.state.props;
    if (props.hyperlink) {
      const link = props.encodeurl ? encodeUrl(props.hyperlink) : props.hyperlink;
      navigationService.openUrl(link, {
        target: this.state.props.target
      });
    }
    this.invokeEventCallback('onTap', [e, this.proxy]);
  }

  public renderSkeleton(props: WmAnchorProps){
    return createSkeleton(this.theme, this.styles.skeleton, {
      ...this.styles.root,
      width: this.props.skeletonwidth || this.styles.root.width,
      height: this.props.skeletonheight || this.styles.root.height
    });
  }

  renderWidget(props: WmAnchorProps) {
      const {
        iconclass,
        iconurl,
        name,
        iconheight,
        iconmargin,
        iconwidth,
        badgevalue,
      } = props;
     
    if (this.styles.icon && this.styles.icon.text) {
      this.styles.icon.text.color = this.styles.text.color;
    }

    const icon = (iconclass || iconurl) && (
      <WmIcon
        id={this.getTestId('icon')}
        styles={this.styles.icon} 
        name={name + '_icon'}
        iconclass={iconclass}
        iconurl={iconurl}
        iconheight={iconheight}
        iconmargin={iconmargin}
        iconwidth={iconwidth}
      />
    );    
    //@ts-ignore
    const badge = badgevalue != undefined ? (<Badge style={this.styles.badge}>{badgevalue}</Badge>): null;
    return (
      <NavigationServiceConsumer>
        {(navigationService: NavigationService) =>
          (<Animatedview entryanimation={props.animation} style={{width: this.styles.root.width, height: this.styles.root.height, justifyContent: 'center'}}>
            <Tappable {...this.getTestPropsForAction()} target={this} styles={[this.styles.root, this.styles.root.width && this.styles.root.height ? { width: '100%', height: '100%'} : null, {flexDirection: props.iconposition === 'top' ? 'column': 'row'}]}
              onTap={props.hyperlink || props.onTap ? (e: TapEvent) => this.onTap(navigationService, e) : undefined}>
              {this._background}
              {props.iconposition === 'top' && icon}
              {props.iconposition === 'left' && icon}
              {props.caption ? (<Text style={this.styles.text}
              {...this.getTestPropsForLabel('caption')} 
              {...getAccessibilityProps(AccessibilityWidgetType.ANCHOR, props)}
              numberOfLines={props.nooflines}>{props.caption}</Text>) : null}
              {props.iconposition === 'right' && icon}
              {badge}
            </Tappable>
          </Animatedview>)
      }
      </NavigationServiceConsumer>
    );
  }
}
