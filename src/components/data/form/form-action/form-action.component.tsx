import React from 'react';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import WmButton from '@wavemaker/app-rn-runtime/components/basic/button/button.component';
import { TapEvent } from '@wavemaker/app-rn-runtime/core/tappable.component';

import WmFormActionProps from './form-action.props';
import { DEFAULT_CLASS, WmFormActionStyles } from './form-action.styles';
import {debounce} from "lodash";
import WmSkeleton from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.component';
import { ThemeConsumer } from '@wavemaker/app-rn-runtime/styles/theme';

export class WmFormActionState extends BaseComponentState<WmFormActionProps> {}

export default class WmFormAction extends BaseComponent<WmFormActionProps, WmFormActionState, WmFormActionStyles> {

  constructor(props: WmFormActionProps) {
    super(props, DEFAULT_CLASS, new WmFormActionProps());
  }

  private _debouncedFormAction = debounce(this.onClick, 250);

  onClick($event: TapEvent, cb: Function | undefined) {
    cb && cb($event);
  }

  public renderSkeleton(){
    return(<WmSkeleton width={this.styles.root.width || 96} height={ this.styles.root?.height || 48} styles={this.theme.mergeStyle(this.styles.skeleton, { root: {
      borderRadius: this.styles.root?.borderRadius || 4,
      marginTop: this.styles.root?.marginTop,
      marginBottom: this.styles.root?.marginBottom,
      marginLeft: this.styles.root?.marginLeft,
      marginRight: this.styles.root?.marginRight,
    }})}/>)
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
