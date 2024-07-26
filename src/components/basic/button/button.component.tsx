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
import { AccessibilityWidgetType, getAccessibilityProps } from '@wavemaker/app-rn-runtime/core/accessibility';

export class WmButtonState extends BaseComponentState<WmButtonProps> {

}

export default class WmButton extends BaseComponent<WmButtonProps, WmButtonState, WmButtonStyles> {

  constructor(props: WmButtonProps) {
    super(props, DEFAULT_CLASS, new WmButtonProps());
  }

  private prepareIcon({
    iconclass,
    iconurl,
    hint,
    name,
    iconsize,
    iconheight,
    iconmargin,
    iconwidth,
  }: any) {
    return iconclass || iconurl
      ? (<WmIcon
          id={this.getTestId('icon')}
          hint={hint}
          styles={this.styles.icon}
          name={`${name}_icon`}
          iconclass={iconclass}
          iconsize={iconsize}
          iconurl={iconurl}
          iconheight={iconheight}
          iconmargin={iconmargin}
          iconwidth={iconwidth}
        />): null;
  }

  private prepareBadge(props: any) {
    //@ts-ignore
    return (<Badge style={this.styles.badge} {...this.getTestProps('badge')}>{props.badgevalue}</Badge>);
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
      <>
      <Animatedview entryanimation={props.animation}
        style={[
          this.styles.root,
          {
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            paddingRight: 0,
            overflow: 'hidden',
            flexDirection: 'column'
          },
          this.styles.root.height == "100%" ? {flex: 1}:{}
        ]}
        // accessibilityProps={{...getAccessibilityProps(
        //   AccessibilityWidgetType.BUTTON,
        //   props
        // )}}
        >
        {this._background}
        <Tappable
          styles={{
            paddingTop: this.styles.root.paddingTop,
            paddingBottom: this.styles.root.paddingBottom,
            paddingLeft: this.styles.root.paddingLeft,
            paddingRight: this.styles.root.paddingRight,
            width: '100%',
            height: this.styles.root.height ? '100%' : null,
            justifyContent: 'center',
          }}
          rippleColor = {this.styles.root.rippleColor}
          target={this}
          {...this.getTestPropsForAction()}
          accessibilityProps={{...getAccessibilityProps(
            AccessibilityWidgetType.BUTTON,
            props
          )}}>
          <View
            style={[
              this.styles.content,
              { flexDirection: props.iconposition === 'top' ? 'column' : 'row' }
            ]}>
            {props.iconposition === 'top' && this.prepareIcon(props)}
            {props.iconposition === 'left' && this.prepareIcon(props)}
            {props.caption ? (
              <Text
                style={this.styles.text}
                {...this.getTestPropsForLabel('caption')}
                importantForAccessibility={'no'}
                // accessibilityLabel={`${props.caption}`}
              >
                {props.caption}
              </Text>
            ) : null}
            {props.iconposition === 'right' && this.prepareIcon(props)}
          </View>
        </Tappable>
      </Animatedview>
      {props.badgevalue && this.prepareBadge(props)}
      </>
    );
  }
}
