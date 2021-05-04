import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { BaseComponent, BaseProps } from '@wavemaker/rn-runtime/core/base.component';

interface WmPageProps extends BaseProps {
  children: any[];
}

export default class WmPage extends BaseComponent<WmPageProps> {

  constructor(props: WmPageProps) {
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
      flex: 1
  }
});
