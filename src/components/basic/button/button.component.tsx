import React from 'react';
import { DimensionValue, LayoutChangeEvent, StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';
import { BaseComponent, BaseComponentState, BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';

import WmButtonProps from './button.props';
import { DEFAULT_CLASS, defaultStyles } from './button.styles';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import { Animatedview } from '@wavemaker/app-rn-runtime/components/basic/animatedview.component';
import { createSkeleton } from '../skeleton/skeleton.component';
import { AccessibilityWidgetType, getAccessibilityProps } from '@wavemaker/app-rn-runtime/core/accessibility';
import { WmSkeletonStyles } from '../skeleton/skeleton.styles';

export class WmButtonState extends BaseComponentState<WmButtonProps> {

}

export default class WmButton extends BaseComponent<WmButtonProps, WmButtonState> {

  constructor(props: WmButtonProps) {
    super(props, DEFAULT_CLASS, new WmButtonProps(), undefined,defaultStyles);
  }


  public renderSkeleton(prop: WmButtonProps) {
    let skeletonWidth, skeletonHeight;
    if(this.props.skeletonwidth == "0") {
      skeletonWidth = 0
    } else {
      skeletonWidth = this.props.skeletonwidth || this.styles.root?.width
    }

    if(this.props.skeletonheight == "0") {
      skeletonHeight = 0
    } else {
      skeletonHeight = this.props.skeletonheight || this.styles.root?.height;
    }
    
    return createSkeleton(this.theme, this.styles.skeleton as unknown as WmSkeletonStyles, {
      ...this.styles.root,
      width: skeletonWidth as DimensionValue,
      height: skeletonHeight as DimensionValue
    });
  }

  renderWidget(props: WmButtonProps) {
    const iconPosition = props.iconposition || 'left';
    const hasCaption = !!props.caption;

  
   // For View styles
    const contentStyle: StyleProp<ViewStyle> = [
      this.styles.content,
      iconPosition === 'top' && this.styles['content-icon-top']
    ].filter(Boolean);

    // For Text styles
    const textStyle: StyleProp<TextStyle> = [
      this.styles.text,
      !hasCaption && this.styles['text-hidden']
    ].filter(Boolean);
      
    const icon = props.iconclass || props.iconurl
      ? (
        <WmIcon
          id={this.getTestId('icon')}
          hint={props.hint}
          styles={this.styles.icon}
          name={`${props.name}_icon`}
          iconclass={props.iconclass}
          iconsize={props.iconsize}
          iconurl={props.iconurl}
          iconheight={props.iconheight}
          iconmargin={props.iconmargin}
          iconwidth={props.iconwidth}
        />
      )
      : null;
  
    return (
      <>
      <Animatedview entryanimation={props.animation} delay={props.animationdelay}
        onLayout={(event: LayoutChangeEvent) => this.handleLayout(event)}
        style={this.styles.root}
        >
        {this._background}
        <Tappable
          disableTouchEffect={this.state.props.disabletoucheffect}
          styles={this.styles.container}
          rippleColor={this.styles.root.rippleColor}
          target={this}
          {...this.getTestPropsForAction()}
          accessibilityProps={{...getAccessibilityProps(
            AccessibilityWidgetType.BUTTON,
            props
          )}}>
          <View style={contentStyle}>
            {(iconPosition === 'top' || iconPosition === 'left') && icon}
            <Text
              style={textStyle}
              {...this.getTestPropsForLabel('caption')}
              importantForAccessibility={'no'}
              // accessibilityLabel={`${props.caption}`}
              >
                {props.caption}
              </Text>
              {iconPosition === 'right' && icon}
          </View>
        </Tappable>
      </Animatedview>
      </>
    );
  }
}
