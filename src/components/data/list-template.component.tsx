import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BaseComponent, BaseProps } from '../../core/base.component';

interface WmListTemplateProps extends BaseProps {
  $index: number;
  $item: any;
  children: any[];
}

export default class WmListTemplate extends BaseComponent<WmListTemplateProps> {

  constructor(props: WmListTemplateProps) {
    super(props);
  }

  render() {
    super.render();
    const props = this.state.props;
    return (<View>{props.children}</View>);
  }
}

const styles = StyleSheet.create({
});
