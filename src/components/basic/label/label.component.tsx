import React from 'react';
import { DimensionValue, LayoutChangeEvent, Text, View,Platform } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import NavigationService, { NavigationServiceConsumer } from '@wavemaker/app-rn-runtime/core/navigation.service';
import { AccessibilityWidgetType, getAccessibilityProps } from '@wavemaker/app-rn-runtime/core/accessibility';

import WmLabelProps from './label.props';
import { DEFAULT_CLASS, WmLabelStyles } from './label.styles';
import { isNil, toString } from 'lodash-es';
import { Animatedview } from '@wavemaker/app-rn-runtime/components/basic/animatedview.component';
import WmSkeleton, { createSkeleton } from '../skeleton/skeleton.component';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { parseLinearGradient } from '@wavemaker/app-rn-runtime/core/utils';


type PartType = {
  text?: string,
  link?: string,
};

export class WmLabelState extends BaseComponentState<WmLabelProps> {
  parts: PartType[] = []
}

export default class WmLabel extends BaseComponent<WmLabelProps, WmLabelState, WmLabelStyles> {

  constructor(props: WmLabelProps) {
    super(props, DEFAULT_CLASS, new WmLabelProps(), new WmLabelState());
  }

  private getAsterisk() {
    return <Text style={this.styles.asterisk}>*</Text>;
  }

  public onPropertyChange(name: string, $new: any, $old: any): void {
    super.onPropertyChange(name, $new, $old);

    switch (name) {
      case "caption":
        this.updateState({
          parts: this.parseCaption(String($new))
        } as WmLabelState);
        break;
    }
  }
  private getMultilineSkeleton(width: any, height: any) {
    const styles = {
      borderRadius: 4,
      marginBottom: 10,
      height: height
    };
    return createSkeleton(this.theme, this.styles.skeleton, {
      ...styles,
      width: width,
      height: height
    });
  }

  parseCaption(caption: string) {
    if (!caption) {
      return [];
    }
    caption += '';
    caption = caption.replace(/\s*\(\s*\$event,\s*\$widget\s*\)\s*/, '');
    caption = caption.replace(/\(\s*\)/, '(#/__EMPTY__)');
    const pattern = /\[([^\]]+)\]\(([^)]*)\)/g;
    const linkRegex = /^(((http|https):\/\/)|javascript:|#).+$/;
    const captionSplit = caption.split(pattern);

    let parts = [];

    for (let i = 0; i < captionSplit.length; i++) {
      const isLink = linkRegex.test(captionSplit[i]);
      let part: PartType = {};

      const isNextTextALink = linkRegex.test(captionSplit[i + 1]);
      if (isLink) {
        part.text = captionSplit[i - 1] ?? '';
        part.link = captionSplit[i] === '#/__EMPTY__' ? '' : captionSplit[i];
      } else {
        part.text = isNextTextALink ? "" : captionSplit[i];
      };
      if (part.text || part.link) {
        parts.push(part);
      }
    }

    return parts;
  }

  public renderSkeleton(props: WmLabelProps) {

    let skeletonWidth, skeletonHeight;
    if (this.props.skeletonwidth == "0") {
      skeletonWidth = 0
    } else {
      skeletonWidth = this.props.skeletonwidth || this.styles.root?.width
    }

    if (this.props.skeletonheight == "0") {
      skeletonHeight = 0
    } else {
      skeletonHeight = this.props.skeletonheight || this.styles.root?.height || this.styles.text.fontSize;
    }

    if (this.props.multilineskeleton) {
      return (<View style={{
        width: skeletonWidth as DimensionValue
      }}>
        {this.getMultilineSkeleton('100%', skeletonHeight)}
        {this.getMultilineSkeleton('70%', skeletonHeight)}
        {this.getMultilineSkeleton('40%', skeletonHeight)}
      </View>)
    }
    else {
      return createSkeleton(this.theme, this.styles.skeleton, {
        ...this.styles.root,
        width: skeletonWidth as DimensionValue,
        height: skeletonHeight as DimensionValue
      });
    }
  }

  private renderLabelTextContent(navigationService: NavigationService, isHidden: boolean = false, hasLinearGradient: boolean = false) {
    //gradient text support for web
    const gradientTextWebStyle = {
      backgroundImage: (this.styles?.text.color as string),
      color: 'transparent',
      backgroundClip: 'text',
    }
    const showWebTextGradient = (hasLinearGradient && Platform.OS === 'web');

    // Shared styles
    const baseStyle = this.styles.text;
    const hiddenStyle = isHidden ? { opacity: 0 } : {};
    const gradientStyle = showWebTextGradient ? gradientTextWebStyle : {};

    // Determine if it's a single part
    const isSinglePart = this.state.parts.length <= 1;

    // Compose final style
    const combinedTextStyle = isSinglePart
      ? { ...baseStyle, ...hiddenStyle, ...gradientStyle }
      : {
          flexWrap: 'wrap',
          textAlign: baseStyle.textAlign,
          ...hiddenStyle,
          ...gradientStyle,
        };



    return (
      <Text style={combinedTextStyle}
        {...this.state.parts.length <= 1 ? this.getTestPropsForLabel('caption') : {}}
        {...getAccessibilityProps(AccessibilityWidgetType.LABEL, this.state.props)}
        numberOfLines={this.state.props.nooflines} ellipsizeMode="tail">
        {(this.state.parts?.length === 1 && !(this.state.parts[0].link && this.state.parts[0].text )) ? toString(this.state.props.caption) : this.state.parts?.map((part, index) => {
          const isLink = !isNil(part.link);
          return (
            <Text
              key={`part_${index}`}
              style={[
                this.styles.text,
                isLink ? this.styles.link.text : null,
                this.state.props.isValid ? null : { color: 'red' }
              ]}
              {...this.getTestPropsForLabel(isLink ? `link_${index}` : `caption_${index}`)}
              selectable={this.styles.text.userSelect === 'text'}
              onPress={() => {
                if (part.link) {
                  if (part.link.startsWith('http:')
                    || part.link.startsWith('https:')
                    || part.link.startsWith('#')) {
                    navigationService.openUrl(part.link, '_blank');
                  } else if (part.link.startsWith('javascript:')) {
                    const eventName = part.link.substring(11);
                    this.invokeEventCallback(eventName, [null, this.proxy]);
                  }
                }
                this.invokeEventCallback('onTap', [null, this.proxy]);
              }}
            // {...getAccessibilityProps(AccessibilityWidgetType.LABEL, props)}
            >
              {toString(part.text)}
            </Text>
          );
        })}
        {this.state.props.required && this.getAsterisk()}
      </Text>
    )

  }
  renderWidget(props: WmLabelProps) {
    const linkStyles = this.theme.mergeStyle({ text: this.styles.text }, this.styles.link);
    const { hasLinearGradient, start, end, gradientColors,colorStops } = parseLinearGradient((this.styles?.text.color) as string);
    
    


    return !isNil(props.caption) ? (
      <Animatedview
        entryanimation={props.animation}
        delay={props.animationdelay}
        style={this.styles.root}
        onLayout={(event: LayoutChangeEvent) => this.handleLayout(event)}
      >
        {this._background}
        <NavigationServiceConsumer>
          {(navigationService: NavigationService) => {
            return (<Tappable target={this} disableTouchEffect={this.state.props.disabletoucheffect} >
              {hasLinearGradient ? <MaskedView
                maskElement={this.renderLabelTextContent(navigationService, false, hasLinearGradient)}
              >
                <LinearGradient colors={gradientColors} start={start} end={end}  locations={colorStops.length > 0 ? colorStops : undefined}>
                  {this.renderLabelTextContent(navigationService, true)}
                </LinearGradient>
              </MaskedView> : this.renderLabelTextContent(navigationService)}
            </Tappable>)
          }}
        </NavigationServiceConsumer>
      </Animatedview>
    ) : null;
  }
}
