import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { BaseComponent, BaseProps } from '@wavemaker/rn-runtime/core/base.component';

interface WmPageContentProps extends BaseProps {
  children: any[];
}

export default class WmPageContent extends BaseComponent<WmPageContentProps> {

  constructor(props: WmPageContentProps) {
    super(props);
  }

  render() {
    super.render();
    const props = this.state.props;
    return (
      <ScrollView style={styles.container}>
        {props.children}
      </ScrollView>
    );
  }
}


const styles = StyleSheet.create({
  container: {
      flex: 1
  }
});
