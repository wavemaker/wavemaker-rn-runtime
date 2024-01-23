import React from 'react';
import { ScrollView, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { isWebPreviewMode } from '@wavemaker/app-rn-runtime/core/utils';
import { HideMode } from '@wavemaker/app-rn-runtime/core/if.component';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmPageContentProps from './page-content.props';
import { DEFAULT_CLASS, WmPageContentStyles } from './page-content.styles';

export class WmPageContentState extends BaseComponentState<WmPageContentProps> {

}

export default class WmPageContent extends BaseComponent<WmPageContentProps, WmPageContentState, WmPageContentStyles> {

  constructor(props: WmPageContentProps) {
    super(props, DEFAULT_CLASS, new WmPageContentProps());
    this.hideMode = HideMode.DONOT_ADD_TO_DOM;
  }

  renderWidget(props: WmPageContentProps) {
    return props.scrollable || isWebPreviewMode() ? (
      // <ScrollView contentContainerStyle={this.styles.root}>
      //   {this._background}
      //   {props.children}
      // </ScrollView>
      <FlatList
        data={[{}]}
        keyExtractor={(_e, i) => `page_content_${i}`}
        ListEmptyComponent={null}
        renderItem={() => (
          <View style={[this.styles.root, { flex: 1 }]}>
            {this._background}
            {props.children}
          </View>
        )}
        // showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.1}
        onEndReached={() => {
          // console.log('parent end reached')
        }}
      />
    ) : (
      <View style={this.styles.root}>
        {this._background}
        {props.children}
      </View>
    ); 
  }
}
