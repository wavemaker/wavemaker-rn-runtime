import React from 'react';
import { Text } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';

import WmLabelProps from './label.props';
import { DEFAULT_CLASS, WmLabelStyles } from './label.styles';
import { isNil, toString } from 'lodash-es';
import { Animatedview } from '@wavemaker/app-rn-runtime/components/basic/animatedview.component';

export class WmLabelState extends BaseComponentState<WmLabelProps> {

}

export default class WmLabel extends BaseComponent<WmLabelProps, WmLabelState, WmLabelStyles> {

  constructor(props: WmLabelProps) {
    super(props, DEFAULT_CLASS, new WmLabelProps());
  }

  private getAsterisk () {
    return <Text style={this.styles.asterisk}>*</Text>;
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
