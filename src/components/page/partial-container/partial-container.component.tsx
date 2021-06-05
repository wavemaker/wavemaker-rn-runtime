import React from 'react';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmPartialContainerProps from './partial-container.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmPartialContainerStyles } from './partial-container.styles';
import PartialService, { PartialConsumer } from '@wavemaker/app-rn-runtime/core/partial.service';

export class WmPartialContainerState extends BaseComponentState<WmPartialContainerProps> {}

export default class WmPartialContainer extends BaseComponent<WmPartialContainerProps, WmPartialContainerState, WmPartialContainerStyles> {

  constructor(props: WmPartialContainerProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmPartialContainerProps());
  }

  render() {
    super.render();
    const props = this.state.props;
    const params = {} as any;
    Object.keys(this.props).forEach((k: string) => {
      //@ts-ignore
      params[k] = props[k];
    });
    params['name'] = params['partial_name'];
    delete params['partial_name'];
    return props.show ? (
      <PartialConsumer>
        {(partialService: PartialService) => {
          return React.createElement(partialService.get(props.content), params);
        }}
      </PartialConsumer>
    ): null; 
  }
}
