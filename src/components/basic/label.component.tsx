import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BaseComponent, BaseProps } from '../../core/base.component';

const DEFAULT_CLASS = 'app-label';

const DEFAULT_STYLES = StyleSheet.create({
  label: {
    fontSize: 20
  }
});

interface WmLabelProps extends BaseProps {
  caption: string;
}

export default class WmLabel extends BaseComponent<WmLabelProps> {

  constructor(props: WmLabelProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES);
  }

  render() {
    super.render();
    const props = this.state.props;
    return <Text style={this.styles.label}>{props.caption}</Text>; 
  }
}
