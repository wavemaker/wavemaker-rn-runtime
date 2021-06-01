import React from 'react';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmPartialContainerProps from './partial-container.props';
import { DEFAULT_CLASS, DEFAULT_STYLES } from './partial-container.styles';
import PartialService, { PartialConsumer } from '@wavemaker/app-rn-runtime/core/partial.service';

export default class WmPartialContainer extends BaseComponent<WmPartialContainerProps, BaseComponentState<WmPartialContainerProps>> {

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
    return props.show ? (
      <PartialConsumer>
        {(partialService: PartialService) => {
          return React.createElement(partialService.get(props.content), params);
        }}
      </PartialConsumer>
    ): null; 
  }
}
