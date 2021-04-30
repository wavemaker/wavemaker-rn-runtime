import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BaseComponent, BaseProps } from '../../core/base.component';

interface WmPrefabContainerProps extends BaseProps {
  children: any[];
}

export default class WmPrefabContainer extends BaseComponent<WmPrefabContainerProps> {

  constructor(props: WmPrefabContainerProps) {
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
