import React from 'react';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmTileProps from './tile.props';
import { DEFAULT_CLASS, WmTileStyles } from './tile.styles';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import { Animatedview } from '@wavemaker/app-rn-runtime/components/basic/animatedview.component';

export class WmTileState extends BaseComponentState<WmTileProps> {}

export default class WmTile extends BaseComponent<WmTileProps, WmTileState, WmTileStyles> {

  constructor(props: WmTileProps) {
    super(props, DEFAULT_CLASS, new WmTileProps());
  }

  renderWidget(props: WmTileProps) {
    return (<Tappable {...this.getTestPropsForAction()} target={this}>
      <Animatedview entryanimation={props.animation} delay={props.animationdelay} style={this.styles.root}>{this._background}{props.children}</Animatedview>
    </Tappable>);
  }
}
