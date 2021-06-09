import React from 'react';
import { StatusBar, View } from 'react-native';

import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmPageProps from './page.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmPageStyles } from './page.styles';
import Viewport, {EVENTS as ViewportEvents} from '@wavemaker/app-rn-runtime/core/viewport';

export class WmPageState extends BaseComponentState<WmPageProps> {
  height: number = 0;
}

export default class WmPage extends BaseComponent<WmPageProps, WmPageState, WmPageStyles> {

  constructor(props: WmPageProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES);
    this.updateState({height: Viewport.height} as WmPageState);
    this.cleanup.push(Viewport.subscribe(ViewportEvents.SIZE_CHANGE, () => {
      this.updateState({height: Viewport.height} as WmPageState);
    }));
  }

  renderWidget(props: WmPageProps) {
    return (
      <View style={[this.styles.root, { height: this.state.height - (StatusBar.currentHeight || 0)}]}>
        {props.children}
      </View>
    ); 
  }
}
