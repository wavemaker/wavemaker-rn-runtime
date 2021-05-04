import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BaseComponent, BaseProps } from '@wavemaker/rn-runtime/core/base.component';

interface WmContentProps extends BaseProps {
  children: any[];
}

export default class WmContent extends BaseComponent<WmContentProps> {

  constructor(props: WmContentProps) {
    super(props);
  }

  render() {
    super.render();
    const props = this.state.props;
    return (
      <View style={styles.container}>
        {props.children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
      flex:1
  }
});
