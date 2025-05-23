import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import WmLabel from '@wavemaker/app-rn-runtime/components/basic/label/label.component';
import WmMenu from '@wavemaker/app-rn-runtime/components/navigation/menu/menu.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import WmPicture from '@wavemaker/app-rn-runtime/components/basic/picture/picture.component';


import WmCardProps from './card.props';
import { DEFAULT_CLASS, WmCardStyles } from './card.styles';
import { WmSkeletonStyles } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.styles';
import { createSkeleton } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.component';

export class WmCardState extends BaseComponentState<WmCardProps> {}

export default class WmCard extends BaseComponent<WmCardProps, WmCardState, WmCardStyles> {

  constructor(props: WmCardProps) {
    super(props, DEFAULT_CLASS, new WmCardProps());
  }

  renderHeader(props: WmCardProps) {
    return (
      <View style={{flexDirection: 'row'}}>
        {(props.iconclass || props.title || props.subheading || props.actions) ?
        (<View style={this.styles.heading}>
        {props.iconclass || props.iconurl ? 
          <WmIcon styles={this.styles.cardIcon}
           iconclass={props.iconclass}
           iconurl={props.iconurl}
           iconheight={props.iconheight}
           iconmargin={props.iconmargin}
           iconwidth={props.iconwidth}
           /> : null} 
          <View style={{flex: 1}}>
            <WmLabel styles={this.styles.title} caption={props.title}></WmLabel>
            <WmLabel styles={this.styles.subheading} caption={props.subheading}></WmLabel>
          </View>
          <WmMenu
            caption=""
            iconclass="wm-sl-l sl-more-menu-vertical"
            dataset={props.actions}
            itemlabel={props.itemlabel}
            itemlink={props.itemlink}
            itemicon={props.itemicon}
            itembadge={props.itembadge}
            isactive={props.isactive}
            itemchildren={props.itemchildren}></WmMenu>
        </View>) : null}
        {props.picturesource &&
          (<WmPicture
            picturesource={props.picturesource}
            styles={this.theme.mergeStyle({root : {height: props.imageheight}}, this.styles.picture)}></WmPicture>
        )}
      </View>);
  }

  public renderSkeleton(props: WmCardProps): React.ReactNode {
    if(!props.showskeletonchildren) {
      const skeletonStyles: WmSkeletonStyles = this.props?.styles?.skeleton || { root: {}, text: {}  } as WmSkeletonStyles
      return createSkeleton(this.theme, skeletonStyles, {
        ...this.styles.root
      }, (<View style={[this.styles.root, { opacity: 0 }]}>
        {props.children}
      </View>))
    }
    return null;
  }

  renderWidget(props: WmCardProps) {
       return (
      <View 
        style={this.styles.root}
        onLayout={(event) => this.handleLayout(event)}
      >
        {this._background}
        <Tappable {...this.getTestPropsForAction()} target={this} styles={{width: '100%', height: this.styles.root.height ? '100%' : null}} disableTouchEffect={this.state.props.disabletoucheffect}>
            {this.renderHeader(props)}
            {props.children}
        </Tappable>
      </View>);
  }
}
