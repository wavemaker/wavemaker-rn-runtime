import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { Header } from 'react-native-elements';
import { BaseComponent, BaseProps } from '@wavemaker/rn-runtime/core/base.component';

export interface WmNavBarProps extends BaseProps {
  title: string;
  onBackbuttonpress: Function;
}

export default class WmNavBar  extends BaseComponent<WmNavBarProps> {

  constructor(props: WmNavBarProps) {
    super(props);
  }

  render () {
    super.render();
    const props = this.state.props;
    return (
      <View style={styles.container}>
        <Header
          centerComponent={{ text: props.title, style: { color: '#fff' } }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
  }
});
