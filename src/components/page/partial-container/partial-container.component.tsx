import React from 'react';
import { View } from 'react-native';

import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmPartialContainerProps from './partial-container.props';
import { DEFAULT_CLASS, WmPartialContainerStyles } from './partial-container.styles';
import { HideMode } from '@wavemaker/app-rn-runtime/core/if.component';
import PartialService, { PartialConsumer } from '@wavemaker/app-rn-runtime/core/partial.service';

export class WmPartialContainerState extends BaseComponentState<WmPartialContainerProps> {}

export default class WmPartialContainer extends BaseComponent<WmPartialContainerProps, WmPartialContainerState, WmPartialContainerStyles> {

  constructor(props: WmPartialContainerProps) {
    super(props, DEFAULT_CLASS, new WmPartialContainerProps());
    this.hideMode = HideMode.DONOT_ADD_TO_DOM;
  }

  renderWidget(props: WmPartialContainerProps) {
    const params = {} as any;
    Object.keys(this.props).forEach((k: string) => {
      //@ts-ignore
      params[k] = props[k];
    });
    params.parent = this.parent;
    params['name'] = params['partial_name'];
    delete params['partial_name'];
    return (
      <View style={this.styles.root}>
        {this._background}
        <PartialConsumer>
          {(partialService: PartialService) => {
            const partial = partialService.get(props.content);
            return partial ? React.createElement(partial, params) : null;
          }}
        </PartialConsumer>
      </View>
    ); 
  }
}
