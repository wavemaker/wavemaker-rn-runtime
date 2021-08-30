import React from 'react';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmTileProps from './tile.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmTileStyles } from './tile.styles';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import { Animatedview } from '@wavemaker/app-rn-runtime/components/basic/animatedview.component';

export class WmTileState extends BaseComponentState<WmTileProps> {}

export default class WmTile extends BaseComponent<WmTileProps, WmTileState, WmTileStyles> {

  constructor(props: WmTileProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmTileProps());
  }

  renderWidget(props: WmTileProps) {
    return (<Tappable target={this}>
      <Animatedview entryanimation={props.animation} style={this.styles.root}>{props.children}</Animatedview>
    </Tappable>);
  }
}
