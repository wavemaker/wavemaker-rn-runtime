import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import WmLabel from '@wavemaker/app-rn-runtime/components/basic/label/label.component';
import WmMenu from '@wavemaker/app-rn-runtime/components/navigation/menu/menu.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import WmPicture from '@wavemaker/app-rn-runtime/components/basic/picture/picture.component';


import WmCardProps from './card.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmCardStyles } from './card.styles';
import { deepCopy } from '@wavemaker/app-rn-runtime/core/utils';

export class WmCardState extends BaseComponentState<WmCardProps> {}

export default class WmCard extends BaseComponent<WmCardProps, WmCardState, WmCardStyles> {

  constructor(props: WmCardProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmCardProps());
  }

  renderHeader(props: WmCardProps) {
    return (
      <View style={{flexDirection: 'row'}}>
        {(props.iconclass || props.title || props.subheading || props.actions) ?
        (<View style={this.styles.heading}>
          <WmIcon styles={this.styles.cardIcon} iconclass={props.iconclass}></WmIcon>
          <View style={{flex: 1}}>
            <WmLabel styles={this.styles.title} caption={props.title}></WmLabel>
            <WmLabel styles={this.styles.subheading} caption={props.subheading}></WmLabel>
          </View>
          <WmMenu
            caption=""
            iconclass="wi wi-more-vert"
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
            styles={deepCopy({root : {height: props.imageheight}}, this.styles.picture)}>
          </WmPicture>)}
      </View>);
  }

  renderWidget(props: WmCardProps) {
    return (
      <View style={this.styles.root}>
        <Tappable target={this} styles={{width: '100%', height: '100%'}}>
            {this.renderHeader(props)}
            {props.children}
        </Tappable>
      </View>); 
  }
}