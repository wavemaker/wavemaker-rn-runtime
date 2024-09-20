import React from 'react';
import { View } from 'react-native';
import { isNil } from 'lodash';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmListTemplateProps from './list-template.props';
import { DEFAULT_CLASS, WmListTemplateStyles } from './list-template.styles';
import WmList from '../list.component';
import { createSkeleton } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.component';

export class WmListTemplateState extends BaseComponentState<WmListTemplateProps> {

}

export default class WmListTemplate extends BaseComponent<WmListTemplateProps, WmListTemplateState, WmListTemplateStyles> {

  constructor(props: WmListTemplateProps) {
    super(props, DEFAULT_CLASS, new WmListTemplateProps());
  }

  renderWidget(props: WmListTemplateProps) {

    if(this._showSkeleton && !props.showskeletonchildren) {  
      return createSkeleton(this.theme, this.styles.skeleton, {
        ...this.styles.root,
       }, (<View style={[this.styles.root, {opacity: 0}]}>
        {props.children}
      </View>))
    }
    
    const list = (this.parent as WmList);
    const listProps = list.state.props;
    const isHorizontalList = listProps.direction === 'horizontal';
    const noOfCols = list.getNoOfColumns();
    let style = this.theme.getStyle( isHorizontalList ? 'horizontal-list-template' : 'vertical-list-template');
    if (isNil(style['flex']) && !isHorizontalList && noOfCols === 1) {
        style = this.theme.mergeStyle({root: {flex: 1}}, style);
    }
    const styles = [this.styles.root, style?.root];
    if(this._showSkeleton) {
      styles.push(this.styles.skeleton.root)
    }
    return (
      <View style={styles}>{this._background}{props.children}</View>
    ); 
  }
}
