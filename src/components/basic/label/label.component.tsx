import React from 'react';
import { DimensionValue, Text, View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';

import WmLabelProps from './label.props';
import { DEFAULT_CLASS, WmLabelStyles } from './label.styles';
import { isNil, toString } from 'lodash-es';
import { Animatedview } from '@wavemaker/app-rn-runtime/components/basic/animatedview.component';
import WmSkeleton, { createSkeleton } from '../skeleton/skeleton.component';
import { totalMonths } from 'react-native-paper-dates/lib/typescript/Date/dateUtils';
import WmAnchor from '../anchor/anchor.component';

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
          parts: this.parseCaption($new)
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
    const pattern = /\[([^\]]+)\]\((http.*?[^)])\)/g;
    const linkRegex = /^(http|https):\/\/[^ "]+$/;
    const captionSplit = caption.split(pattern);

    let parts = [];

    for (let i = 0; i < captionSplit.length; i++) {
      const isLink = linkRegex.test(captionSplit[i]);
      let part: PartType = {};
      
      const isNextTextALink = linkRegex.test(captionSplit[i + 1]) || false;
      if (isLink) {
        part.text = captionSplit[i - 1] ?? '';
        part.link = captionSplit[i];
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
    return !isNil(props.caption) ? (
      <Animatedview entryanimation={props.animation} style={this.styles.root}>
        {this._background}
        <Tappable target={this}>
          <Text style={{flex: 1, flexWrap: "wrap"}}>
            {this.state.parts?.map((part, index) => (
              <React.Fragment key={`part_${index}`}>
                {part.link ? (
                  <WmAnchor styles={this.styles.link} caption={part.text} hyperlink={part.link} />
                ) : (
                  <Text
                    style={[
                      this.styles.text,
                      {
                        color:
                          props.isValid === false
                            ? 'red'
                            : this.styles.text.color,
                      },
                    ]}
                    numberOfLines={props.wrap ? undefined : 1}
                    selectable={this.styles.text.userSelect === 'text'}
                  >
                    {toString(part.text)}
                    {props.required && this.getAsterisk()}
                  </Text>
                )}
              </React.Fragment>
            ))}
          </Text>
        </Tappable>
      </Animatedview>
    ) : null;
  }
}
