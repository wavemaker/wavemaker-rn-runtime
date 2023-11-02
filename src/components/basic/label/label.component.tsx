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

export class WmLabelState extends BaseComponentState<WmLabelProps> {

}

export default class WmLabel extends BaseComponent<WmLabelProps, WmLabelState, WmLabelStyles> {

  constructor(props: WmLabelProps) {
    super(props, DEFAULT_CLASS, new WmLabelProps());
  }

  private getAsterisk () {
    return <Text style={this.styles.asterisk}>*</Text>;
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
    return !isNil(props.caption)? (
      <Animatedview entryanimation={props.animation} style={this.styles.root}>
        {this._background}
        <Tappable target={this}>
            <Text
              style={[this.styles.text,
              {color: props.isValid === false ? 'red' : this.styles.text.color}]}
              ellipsizeMode="tail"
              numberOfLines={props.wrap? undefined : props.noOfLines}
              selectable={this.styles.text.userSelect === 'text'}>
              {toString(props.caption)}
              {props.required && this.getAsterisk()}
            </Text>
        </Tappable>
      </Animatedview>
    ): null;
  }
}
