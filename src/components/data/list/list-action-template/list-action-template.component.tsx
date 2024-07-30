import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmListActionTemplateProps from './list-action-template.props';
import { DEFAULT_CLASS, WmListActionTemplateStyles } from './list-action-template.styles';
import WmList from '../list.component';

export class WmListActionTemplateState extends BaseComponentState<WmListActionTemplateProps> { }

export default class WmListActionTemplate extends BaseComponent<WmListActionTemplateProps, WmListActionTemplateState, WmListActionTemplateStyles> {

  constructor(props: WmListActionTemplateProps) {
    super(props, DEFAULT_CLASS, new WmListActionTemplateProps(), new WmListActionTemplateState());
  }

  getTemplate() {
    return (
      <View style={this.styles.root}>{this._background}
        {this.props.children}
      </View>);
  }

  componentDidMount(): void {
      const list = (this.parent) as WmList;
      if (this.state.props.position === 'left') {
        list.leftActionTemplate = this;
      } else if (this.state.props.position === 'right') {
        list.rightActionTemplate = this;
      }
  }

  renderWidget(props: WmListActionTemplateProps) {
    return null;
  }
}
