import React from 'react';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import WmButton from '@wavemaker/app-rn-runtime/components/basic/button/button.component';
import { TapEvent } from '@wavemaker/app-rn-runtime/core/tappable.component';

import WmFormActionProps from './form-action.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmFormActionStyles } from './form-action.styles';
import {debounce} from "lodash";

export class WmFormActionState extends BaseComponentState<WmFormActionProps> {}

export default class WmFormAction extends BaseComponent<WmFormActionProps, WmFormActionState, WmFormActionStyles> {

  constructor(props: WmFormActionProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmFormActionProps());
  }

  private _debouncedFormAction = debounce(this.onClick, 250);

  onClick($event: TapEvent, cb: Function | undefined) {
    cb && cb($event);
  }

  renderWidget(props: WmFormActionProps) {
    return (
      <WmButton
        disabled={props.disabled}
        caption={props.displayName}
        styles={this.styles}
        name={props.name}
        iconclass={props.iconclass}
        onTap={($event: any) => {
          this._debouncedFormAction($event, props.formAction);
        }}
      />
    );
  }
}
