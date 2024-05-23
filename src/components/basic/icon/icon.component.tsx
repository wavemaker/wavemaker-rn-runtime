import React from 'react';
import { Animated, DimensionValue, Easing, Text, Image, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import { isFullPathUrl } from '@wavemaker/app-rn-runtime/core/utils'; 
import { AccessibilityWidgetType, getAccessibilityProps } from '@wavemaker/app-rn-runtime/core/accessibility';

import WmIconProps from './icon.props';
import { DEFAULT_CLASS, WmIconStyles } from './icon.styles';
import WavIcon from './wavicon/wavicon.component';
import StreamlineLightIcon from './streamline-light-icon/streamline-light-icon.component';
import StreamlineRegularIcon from './streamline-regular-icon/streamline-regular-icon.component';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import { Animatedview } from '@wavemaker/app-rn-runtime/components/basic/animatedview.component';
import WmSkeleton, { createSkeleton } from '../skeleton/skeleton.component';

interface IconDef {
  isFontAwesome: boolean;
  isWavIcon: boolean;
  isStreamlineLightIcon: boolean;
  isStreamlineRegularIcon: boolean;
  type: string;
  rotate: string;
  size: number;
  animation: string;
}

const ICON_SIZES = new Map([
  ['fa-lg', 24],
  ['fa-2x', 36],
  ['fa-3x', 48],
  ['fa-4x', 60],
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

export default class WmIcon extends BaseComponent<WmIconProps, WmIconState, WmIconStyles> {
  spinValue = new Animated.Value(0);
  pulseValue = new Animated.Value(0);
  public stopAnimation = true; 
  private _iconSource = null as any;

  constructor(props: WmIconProps) {
    super(props, DEFAULT_CLASS, new WmIconProps());
  }

  getIconDef(iconClass: string): IconDef {
    const iconDef = {
      rotate: '0'
    } as IconDef;
    const splits = iconClass.split(' ');
    iconDef.isFontAwesome = !!splits.find(v => v === 'fa');
    iconDef.isStreamlineLightIcon = !!splits.find(v => v === 'wm-sl-l');
    iconDef.isStreamlineRegularIcon = !!splits.find(v => v === 'wm-sl-r');
    if (iconDef.isFontAwesome) {
      iconDef.type = splits.find(v => v.startsWith('fa-'))?.substring(3) || '';
    } else if (iconDef.isStreamlineLightIcon) {
      iconDef.type = splits.find(v => v.startsWith('sl-'))?.substring(3) || '';
    } else if (iconDef.isStreamlineRegularIcon) {
      iconDef.type = splits.find(v => v.startsWith('sl-'))?.substring(3) || '';
    } else {
      iconDef.isWavIcon = !iconDef.isFontAwesome && !!splits.find(v => v === 'wi');
      iconDef.type = (iconDef.isWavIcon && splits.find(v => v.startsWith('wi-'))?.substring(3)) || '';
    }
    if (iconClass.indexOf('fa-spin') >= 0) {
      iconDef.animation = 'spin';
    } else if (iconClass.indexOf('fa-pulse') >= 0) {
      iconDef.animation = 'pulse';
    }
    iconDef.size = splits.map(v => ICON_SIZES.get(v)).find(v => !!v) || 12;
    iconDef.rotate = splits.map(v => ICON_ROTATTION.get(v)).find(v => !!v) || '0deg';
    return iconDef;
  }

  private spin () {
    if (this.stopAnimation) {
      return;
    }
    this.spinValue.setValue(0);
    Animated.timing(
      this.spinValue,
      {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true
      }
    ).start(() => this.spin());
  }

  componentDidMount() {
    super.componentDidMount();
    this.spin();
  }

  componentWillUnmount(): void {
      super.componentWillUnmount();
      this.stopAnimation = true;
  }

  onPropertyChange(name: string, $new: any, $old: any) {
    super.onPropertyChange(name, $new, $old);
    switch(name) {
      case 'iconclass':
        $new && this.updateState({iconDef: this.getIconDef($new)} as WmIconState);
        break;
    }
  }

  private getCustomIcon(props: WmIconProps, style: any) {
    const customIcon = this.theme.mergeStyle({}, this.theme.getStyle(props?.iconclass || '')?.icon || this.styles.icon);
    const customIconContent = customIcon?.content;
    if (customIconContent) {
      delete customIcon.content;
      return (<Text
        style={[style, customIcon.fontFamily ? {fontFamily: customIcon.fontFamily}: null]}>
          {decodeURIComponent(customIconContent)}
      </Text>);
    }
    return null;
  }

  public renderSkeleton(props: WmIconProps) {
    return createSkeleton(this.theme, this.styles.skeleton, {
      ...this.styles.root,
      width: (this.props.skeletonwidth || this.props.iconsize || this.styles.root.width) as DimensionValue,
      height: (this.props.skeletonheight || this.props.iconsize || this.styles.root.height) as DimensionValue
    });
  }

  getElementToShow(props: WmIconProps, iconSrc: any) {

    const { iconmargin, iconheight, iconwidth } = props;
    let width, height;
    let elementToshow, source;

    if (iconwidth) width = iconwidth;
    else if (iconheight) width = iconheight;
    else width = 12;
    if (iconheight) height = iconheight;
    else if (iconwidth) height = iconwidth;
    else height = 12;

    if (isFullPathUrl(iconSrc)) {
      source = {
        uri: iconSrc
      };
    } else {
      source = iconSrc;
    }
    elementToshow = <Image testID={this.getTestId('icon')}
      style={{
        margin: iconmargin ?? 0,
        height: height,
        width: width
      }}
      source={source}/>;
    return elementToshow;
  }

  loadIcon(iconImage: string | undefined) {
    if (!iconImage || !this.loadAsset) {
      return null;
    }
    const iconImageSrc = this.loadAsset(iconImage);
    if (iconImageSrc && typeof iconImageSrc !== 'function') {
      return iconImageSrc;
    }
    return null;
  }

  renderIcon(props: WmIconProps) {
    let iconJsx = null;
    this._iconSource =  this._iconSource || this.loadIcon(props.iconurl);
    const iconSrc: any = this._iconSource 
    if (iconSrc) {
      return this.getElementToShow(props, iconSrc);
    }
    const iconDef = this.state.iconDef;
    if (!iconDef) {
      return null;
    }
    const { root, text, icon } = this.styles;
    const style = [{ color: root.color || text.color },
    icon,
    { transform: [{ rotate: iconDef.rotate }] }];

    const customIcon = this.getCustomIcon(props, style);
    const iconSize = props.iconsize || this.styles.root.fontSize || this.styles.text.fontSize || iconDef.size;
    if (props.show && iconDef && iconDef.isFontAwesome) {
      //@ts-ignore type information is not matching
      iconJsx = (<FontAwesome name={customIcon ? '' : iconDef.type}
        style={style}
        size={iconSize}>
          {customIcon}
        </FontAwesome>);
    } else if (props.show && iconDef) {
      let WMCustomIcon = WavIcon as unknown;
      if (iconDef.isStreamlineLightIcon) {
        WMCustomIcon = StreamlineLightIcon;
      } else if (iconDef.isStreamlineRegularIcon) {
        WMCustomIcon = StreamlineRegularIcon;
      } else if (!iconDef.isWavIcon && !customIcon && !this.styles.icon?.fontFamily) {
        return null;
      }
      //@ts-ignore type information is not matching
      iconJsx = WMCustomIcon ? (<WMCustomIcon name={customIcon ? '' : iconDef.type}
        style={style}
        size={iconSize}>
        {customIcon}
      </WMCustomIcon>) : null;
    }
    if (iconJsx && iconDef.animation === 'spin') {
      const rotate = this.spinValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg']});
      const animation = { transform: [{ rotate }] };
      this.stopAnimation = false;
      return (<Animated.View style={animation}>{iconJsx}</Animated.View>);
    } else if (iconJsx && iconDef.animation === 'pulse') {
      const opacity = this.spinValue.interpolate({ inputRange: [0, 1], outputRange: [0, 1]});
      const animation = { opacity: opacity };
      this.stopAnimation = false;
      return (<Animated.View style={animation}>{iconJsx}</Animated.View>);
    } else {
      this.stopAnimation = true;
    }
    return (
      <View
        // {...getAccessibilityProps(AccessibilityWidgetType.ICON, this.props)}
      >
        {iconJsx}
      </View>
    );
  }

  renderWidget(props: WmIconProps) {
    let icon = this.renderIcon(props);
    let iterationCount: any = props.iterationcount ? (props.iterationcount != 'infinite' ? parseInt(props.iterationcount): 'infinite') : undefined;
    return (
      <Tappable target={this} rippleColor = {this.styles.root.rippleColor} {...this.getTestPropsForAction()} accessibilityProps={{...getAccessibilityProps(AccessibilityWidgetType.ICON, props)}}>  
        <Animatedview entryanimation={props.animation} style={this.styles.root} iterationCount={iterationCount}>
          {this._background}
          {(props.iconposition === 'left' && icon) || null}
          {(props.caption && (<Text {...this.getTestPropsForLabel('caption')}style={this.styles.text} accessibilityRole={props?.accessibilityrole ? props?.accessibilityrole : 'text'}>{props.caption}</Text>)) || null}
          {(props.iconposition === 'right' && icon) || null}
        </Animatedview>
      </Tappable>
    );
  }
}
