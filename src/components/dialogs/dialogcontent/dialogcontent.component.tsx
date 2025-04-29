import React from 'react';
import { TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmDialogcontentProps from './dialogcontent.props';
import { DEFAULT_CLASS, WmDialogcontentStyles } from './dialogcontent.styles';

export class WmDialogcontentState extends BaseComponentState<WmDialogcontentProps> {}

export default class WmDialogcontent extends BaseComponent<WmDialogcontentProps, WmDialogcontentState, WmDialogcontentStyles> {

  constructor(props: WmDialogcontentProps) {
    super(props, DEFAULT_CLASS, new WmDialogcontentProps());
  }

  renderWidget(props: WmDialogcontentProps) {
    return (<ScrollView
     
      alwaysBounceVertical={false}
      alwaysBounceHorizontal={false}
      onLayout={(event) => this.handleLayout(event)}
      contentContainerStyle={[this.styles.root, {maxHeight: undefined}]}
      onScroll={(event) => {this.notify('scroll', [event])}}
      scrollEventThrottle={48}
      showsVerticalScrollIndicator={false}
      style={{maxHeight: this.styles.root.maxHeight}}>
        {this._background}

        {/* *IMPORTANT: Pan responder in WmDialog interfering with scroll of ScrollView [https://github.com/facebook/react-native/issues/11206] */}
        <TouchableOpacity 
          activeOpacity={1}
        >
          <>
            {props.children}
          </>
        </TouchableOpacity>
    </ScrollView>);
  }
}
