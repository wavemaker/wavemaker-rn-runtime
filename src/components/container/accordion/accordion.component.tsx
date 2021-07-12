import React from 'react';
import { Text, View } from 'react-native';
import { Badge, List } from 'react-native-paper';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmAccordionProps from './accordion.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmAccordionStyles } from './accordion.styles';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';

export class WmAccordionState extends BaseComponentState<WmAccordionProps> {
  expandedId: any;
}

export default class WmAccordion extends BaseComponent<WmAccordionProps, WmAccordionState, WmAccordionStyles> {

  constructor(props: WmAccordionProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmAccordionProps());
  }

  expandCollapseIcon(props: any, item: any) {
    const widgetProps = item.props;
    //@ts-ignore
    const badge = widgetProps.badgevalue != undefined ? (<Badge style={[this.styles.badge, this.styles[widgetProps.badgetype || 'default']]}>{widgetProps.badgevalue}</Badge>): null;
    const iconclass = props.isExpanded ? 'wi wi-minus' : 'wi wi-plus';
    return (<Text>{badge}<WmIcon name={'expand_collapse_icon'} iconclass={iconclass}></WmIcon></Text>);
  }

  renderAccordionpane(item: any, index: any) {
    const icon = (<WmIcon styles={this.styles.icon} name={item.props.name + '_icon'} iconclass={item.props.iconclass}></WmIcon>);
    return (
      <List.Accordion title={item.props.title || 'Title'} style={this.styles.header} titleStyle={this.styles.text} descriptionStyle={this.styles.subheading} description={item.props.subheading} id={index + 1} key={'accordionpane_' + index}
                      right={props => this.expandCollapseIcon(props, item)} left={props => icon}>
        <View>{item}</View>
      </List.Accordion>
    );
  }

  onAccordionPress(expandedId: any) {
    const props = this.state.props;
    const oldIndex = this.state.expandedId;
    const paneId = oldIndex === expandedId ? -1 : expandedId;
    this.updateState({
      expandedId: paneId,
    } as WmAccordionState);

    const expandedPane = props.children[paneId - 1];
    const collapsedPane = props.children[oldIndex ? oldIndex-1 : props.defaultpaneindex];

    this.invokeEventCallback('onChange', [{}, this.proxy, paneId-1, oldIndex ? oldIndex-1 : props.defaultpaneindex,
      expandedPane && expandedPane.props.name, collapsedPane && collapsedPane.props.name])
  }

  renderWidget(props: WmAccordionProps) {
    const accordionpanes = props.children;
    return (
        <View style={this.styles.root}>
          <List.AccordionGroup expandedId={this.state.expandedId || props.defaultpaneindex + 1} onAccordionPress={this.onAccordionPress.bind(this)} >
            {accordionpanes && accordionpanes.length
              ? accordionpanes.map((item: any, index: any) => this.renderAccordionpane(item, index))
              : null}
          </List.AccordionGroup>
        </View>
    );
  }
}
