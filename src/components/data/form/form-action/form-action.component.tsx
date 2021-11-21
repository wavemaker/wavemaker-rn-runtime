import React from 'react';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import WmButton from '@wavemaker/app-rn-runtime/components/basic/button/button.component';

import WmFormActionProps from './form-action.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmFormActionStyles } from './form-action.styles';

export class WmFormActionState extends BaseComponentState<WmFormActionProps> {}

export default class WmFormAction extends BaseComponent<WmFormActionProps, WmFormActionState, WmFormActionStyles> {

  constructor(props: WmFormActionProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmFormActionProps());
  }

  onClick(cb: Function | undefined) {
    cb && cb();
  }

  renderWidget(props: WmFormActionProps) {
    let btnClass = 'btn-default';

    return (
      <WmButton
        caption={props.displayName}
        styles={this.theme.getStyle(btnClass)}
        name={props.name}
        iconclass={props.iconclass}
        onTap={
          props.formAction && this.onClick.bind(undefined, props.formAction)
        }
      />
    );
  }
}
