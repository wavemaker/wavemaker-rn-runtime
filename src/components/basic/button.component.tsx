import React from 'react';
import { StyleSheet, Text, TouchableOpacity} from 'react-native';

import { BaseComponent, BaseProps } from '../../core/base.component';
import BASE_THEME from '../../styles/theme';

const DEFAULT_CLASS = 'app-button';

const DEFAULT_STYLES = {
  button: {
    backgroundColor: 'blue',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    margin: 5
  },
  text: {
      textAlign: "center",
      color: "#ffffff"
  }
};

interface WmButtonProps extends BaseProps {
  caption?: string;
}

export default class WmButton extends BaseComponent<WmButtonProps> {

  constructor(props: WmButtonProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES);
  }

  render() {
    super.render();
    const props = this.state.props;
    return (
    <TouchableOpacity 
      style={this.styles.button}
      onPress={() => this.invokeEventCallback('onTap', [null, this.proxy])}>
        <Text style={this.styles.text}>{props.caption}</Text>
    </TouchableOpacity>
    ); 
  }
}

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
BASE_THEME.addStyle('btn-success', DEFAULT_CLASS, {
  button: {
      backgroundColor: 'green'
  }
});
BASE_THEME.addStyle('btn-danger', DEFAULT_CLASS, {
  button: {
      backgroundColor: 'red'
  }
});
