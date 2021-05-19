import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { BaseComponent, BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

interface WmContainerProps extends BaseProps {
  children: any[],
  onTap: Function
}

const DEFAULT_CLASS = 'app-container';

const DEFAULT_STYLES = {
  container: {}
};

export default class WmContainer extends BaseComponent<WmContainerProps> {
  constructor(props: WmContainerProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES);
  }

  render () {
    super.render();
    const props = this.state.props;
    return (
      <TouchableWithoutFeedback onPress={() => this.invokeEventCallback('onTap', [null, this])}>
        <View style={this.styles.root}>
          {props.children}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
