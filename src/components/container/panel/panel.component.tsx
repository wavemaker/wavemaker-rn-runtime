import React from 'react';
import { Text, View } from 'react-native';
import { Badge, List } from 'react-native-paper';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';

import WmPanelProps from './panel.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmPanelStyles } from './panel.styles';

export class WmPanelState extends BaseComponentState<WmPanelProps> {
  expandedId: any;
}

export default class WmPanel extends BaseComponent<WmPanelProps, WmPanelState, WmPanelStyles> {

  constructor(props: WmPanelProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmPanelProps());
    this.updateState({
      expandedId: this.state.props.expanded ? 1 : -1,
    } as WmPanelState);
  }

  renderContent(props: WmPanelProps) {
    if (props.renderPartial) {
      if (!this.state.props.isPartialLoaded) {
        this.state.props.isPartialLoaded = true;
        setTimeout(() => {
          this.invokeEventCallback('onLoad', [null, this]);
        });
      }
      return props.renderPartial();
    }
  }

  onPanelPress(expandedId: any) {
    if (!this.state.props.collapsible || !this.state.props.expanded) {
      return;
    }
    const paneId = expandedId === this.state.expandedId ? -1 : 1;
    this.updateState({
      expandedId: paneId,
    } as WmPanelState);
    const eventName = paneId === 1 ? 'onExpand' : 'onCollapse';
    this.invokeEventCallback(eventName, [null, this.proxy]);
  }

  expandCollapseIcon(props: any) {
    const widgetProps = this.state.props;
    //@ts-ignore
    const badge = widgetProps.badgevalue != undefined ? (<Badge style={[this.styles.badge, this.styles[widgetProps.badgetype || 'default']]}>{widgetProps.badgevalue}</Badge>): null;
    const iconclass = props.isExpanded ? 'wi wi-minus' : 'wi wi-plus';
    const expandCollapseIcon = widgetProps.collapsible ? (<WmIcon name={'expand_collapse_icon'} iconclass={iconclass}></WmIcon>) : null;
    return (<Text>{badge}{expandCollapseIcon}</Text>);
  }

  renderPanel(props: any) {
    const icon = (<WmIcon styles={this.styles.icon} name={props.name + '_icon'} iconclass={props.iconclass}></WmIcon>);
    return (
      <List.Accordion title={props.title || 'Title'} style={this.styles.header} id={1}
                      titleStyle={this.styles.text} descriptionStyle={this.styles.subheading}
                      description={props.subheading}
                      right={props => this.expandCollapseIcon(props)} left={props => icon}>
        <View>{this.renderContent(props)}</View>
        <View>{props.children}</View>
      </List.Accordion>
    );
  }


  renderWidget(props: WmPanelProps) {
    return (<View style={this.styles.root}><List.AccordionGroup expandedId={this.state.expandedId}
                                       onAccordionPress={this.onPanelPress.bind(this)}>{this.renderPanel(props)}</List.AccordionGroup></View>);
  }
}
