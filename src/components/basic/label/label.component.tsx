import React from 'react';
import { DimensionValue, Text, View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import NavigationService, { NavigationServiceConsumer } from '@wavemaker/app-rn-runtime/core/navigation.service';
import { AccessibilityWidgetType, getAccessibilityProps } from '@wavemaker/app-rn-runtime/core/accessibility';

import WmLabelProps from './label.props';
import { DEFAULT_CLASS, WmLabelStyles } from './label.styles';
import { isNil, toString } from 'lodash-es';
import { Animatedview } from '@wavemaker/app-rn-runtime/components/basic/animatedview.component';
import WmSkeleton, { createSkeleton } from '../skeleton/skeleton.component';

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

  private getAsterisk () {
    return <Text style={this.styles.asterisk}>*</Text>;
  }

  public onPropertyChange(name: string, $new: any, $old: any): void {
    super.onPropertyChange(name, $new, $old);

    switch(name) {
      case "caption":
        this.updateState({
          parts: this.parseCaption(String($new))
        } as WmLabelState);
        break;
    }
  }
  private getMultilineSkeleton(width: any, height: any) {
    const styles = {
      borderRadius:4,
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

      if (part.text) {
        parts.push(part);
      }
    }

    return parts;
  }

  public renderSkeleton(props: WmLabelProps){
    const skeletonWidth = this.props.skeletonwidth || this.styles.root?.width;
    const skeletonHeight = this.props.skeletonheight || this.styles.root?.height || this.styles.text.fontSize;
    if(this.props.multilineskeleton) {
      return (<View style={{
        width: skeletonWidth as DimensionValue
      }}>
        {this.getMultilineSkeleton('100%', skeletonHeight)}
        {this.getMultilineSkeleton('70%', skeletonHeight)}
        {this.getMultilineSkeleton('40%', skeletonHeight)}
      </View>)
    }
    else{
      return createSkeleton(this.theme, this.styles.skeleton, {
        ...this.styles.root,
        width: skeletonWidth as DimensionValue,
        height: skeletonHeight as DimensionValue
      });  
    }
  }

  renderWidget(props: WmLabelProps) {
    const linkStyles = this.theme.mergeStyle({text: this.styles.text}, this.styles.link);
    return !isNil(props.caption) ? (
      <Animatedview entryanimation={props.animation} style={this.styles.root}>
        {this._background}
        <NavigationServiceConsumer>
        {(navigationService: NavigationService) => {
          return (<Tappable target={this}>
            <Text style={ this.state.parts.length <= 1 ? this.styles.text : {flexWrap: "wrap", textAlign: this.styles.text.textAlign}}
              {...this.state.parts.length <= 1 ? this.getTestPropsForLabel('caption') : {}}
              numberOfLines={props.nooflines} ellipsizeMode="tail">
              {this.state.parts?.length === 1 ? this.state.props.caption : this.state.parts?.map((part, index) => {
                const isLink = !isNil(part.link);
                return (
                  <Text
                    key={`part_${index}`}
                    style={[
                      this.styles.text,
                      isLink ? this.styles.link.text : null,
                      props.isValid ? null : { color: 'red'}
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
                    {...getAccessibilityProps(AccessibilityWidgetType.LABEL, props)}
                  >
                    {toString(part.text)}
                    {props.required && this.getAsterisk()}
                  </Text>
                );
              })}
            </Text>
          </Tappable>)}}
        </NavigationServiceConsumer>
      </Animatedview>
    ) : null;
  }
}
