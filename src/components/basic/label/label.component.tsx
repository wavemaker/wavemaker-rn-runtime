import React from 'react';
import { Text } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';

import WmLabelProps from './label.props';
import { DEFAULT_CLASS, WmLabelStyles } from './label.styles';
import { isNil, toString } from 'lodash-es';
import { Animatedview } from '@wavemaker/app-rn-runtime/components/basic/animatedview.component';
import WmSkeleton from '../skeleton/skeleton.component';
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

  public renderSkeleton(){
    if(this.props.multiline){
      const styles = {borderRadius:4, marginBottom: 10}
      return (<>
        <WmSkeleton width={170} height={10} styles={this.theme.mergeStyle(this.styles.skeleton, {root:styles})} />
        <WmSkeleton width={120} height={10} styles={this.theme.mergeStyle(this.styles.skeleton, {root:styles})} />
        <WmSkeleton width={80} height={10} styles={this.theme.mergeStyle(this.styles.skeleton, {root:styles})} />
      </>)
    }
    else{
      return ( <WmSkeleton width={this.props.skeletonwidth || this.styles.root?.width || "100%"} height={this.props.skeletonheight || this.styles.root?.height || this.styles.text.fontSize || 10} styles={ this.theme.mergeStyle(this.styles.skeleton, { root: {
        borderRadius: this.styles.root?.borderRadius || 4,
        marginTop: this.styles.root?.marginTop,
        marginBottom: this.styles.root?.marginBottom,
        marginLeft: this.styles.root?.marginLeft,
        marginRight: this.styles.root?.marginRight,
      }}) }/> );  
    }
  }

  renderWidget(props: WmLabelProps) {
    return !isNil(props.caption)? (
      <Animatedview entryanimation={props.animation} style={this.styles.root}>
        <Tappable target={this}>
            <Text
              style={[this.styles.text, 
                {color: props.isValid === false ? 'red' : this.styles.text.color}]}
              numberOfLines={props.wrap ? undefined : 1}>
              {toString(props.caption)}
              {props.required && this.getAsterisk()}
            </Text>
        </Tappable>
      </Animatedview>
    ): null;
  }
}
