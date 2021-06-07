import React from 'react';
import { Text } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';

import WmLabelProps from './label.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmLabelStyles } from './label.styles';

export class WmLabelState extends BaseComponentState<WmLabelProps> {

}

export default class WmLabel extends BaseComponent<WmLabelProps, WmLabelState, WmLabelStyles> {

  constructor(props: WmLabelProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmLabelProps());
  }

  private getAsterisk () {
    return <Text style={this.styles.asterisk}>*</Text>;
  }

  render() {
    super.render();
    const props = this.state.props;
    return props.show ? (
      <Tappable target={this}>
          <Text style={this.styles.root}>{props.caption}
            {props.required && this.getAsterisk()}
          </Text>
      </Tappable>
    ): null;
  }
}
