import React from 'react';
import { Text, View } from 'react-native';
import { Badge, List } from 'react-native-paper';
import { isArray } from 'lodash';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmAccordionProps from './accordion.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmAccordionStyles } from './accordion.styles';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import { Animatedview } from '@wavemaker/app-rn-runtime/components/basic/animatedview.component';
import WmAccordionpane from './accordionpane/accordionpane.component';

export class WmAccordionState extends BaseComponentState<WmAccordionProps> {
  expandedId: any;
}

export default class WmAccordion extends BaseComponent<WmAccordionProps, WmAccordionState, WmAccordionStyles> {
  private animatedRef: any;
  public accordionPanes = [] as WmAccordionpane[];
  private newIndex = 0;

  constructor(props: WmAccordionProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmAccordionProps());
    this.updateState({
      expandedId: (this.state.props.defaultpaneindex || 0) + 1
    } as WmAccordionState);
  }

  addAccordionPane(accordionPane: WmAccordionpane) {
    this.accordionPanes[(this.newIndex || this.state.expandedId) - 1] = accordionPane;
  }

  expandCollapseIcon(props: any, item: any) {
    const widgetProps = item.props;
    //@ts-ignore
    const badge = widgetProps.badgevalue != undefined ? (<Badge style={[this.styles.badge, this.styles[widgetProps.badgetype || 'default']]}>{widgetProps.badgevalue}</Badge>): null;
    const iconclass = props.isExpanded ? 'wi wi-minus' : 'wi wi-plus';
    return (<View style={{flexDirection: 'row'}}>
            {badge}
            <WmIcon 
              styles={props.isExpanded ? this.styles.activeIcon : this.styles.icon}
              name={'expand_collapse_icon'}
              iconclass={iconclass}></WmIcon>
          </View>);
  }

  renderAccordionpane(item: any, index: any, isExpanded = true) {
    const icon = (<WmIcon styles={this.styles.icon} name={item.props.name + '_icon'} iconclass={item.props.iconclass}></WmIcon>);
    return (
      <List.Accordion title={item.props.title || 'Title'}
                      style={[this.styles.header, isExpanded ? this.styles.activeHeader : {}]}
                      theme={{
                        colors: {
                          background : this.styles.header.backgroundColor,
                          primary: this.styles.activeHeader.color
                        }
                      }}
                      titleStyle={[this.styles.text, isExpanded ? this.styles.activeHeaderTitle : {}]}
                      descriptionStyle={this.styles.subheading}
                      description={item.props.subheading}
                      id={index + 1}
                      key={'accordionpane_' + index}
                      right={props => this.expandCollapseIcon(props, item)} left={props => icon}>
          <Animatedview style={{marginLeft: -64}} ref={ref => this.animatedRef = ref} entryanimation={this.state.props.animation}>{item}</Animatedview>
      </List.Accordion>
    );
  }

  onAccordionPress(expandedId: any) {
    const oldIndex = this.state.expandedId;
    this.newIndex = expandedId;
    const collapsedPane = oldIndex ? this.accordionPanes[oldIndex - 1]: null;
    collapsedPane?.onPaneCollapse();
    Promise.resolve().then(() => {
      if (this.state.expandedId >= 0) {
        return this.animatedRef.triggerExit().then((res: any) => !res && Promise.reject());
      }
    }).then(() => {
      if (this.state.expandedId === expandedId) {
        expandedId = -1;
      }
      this.updateState({
        expandedId: expandedId,
      } as WmAccordionState, () => {
        const expandedPane = expandedId ? this.accordionPanes[expandedId - 1]: null;
        expandedPane?.onPaneExpand();
        this.invokeEventCallback('onChange', [{}, 
          this.proxy, 
          expandedId - 1, 
          oldIndex ? oldIndex - 1 : null,
          expandedPane && expandedPane.props.name,
          collapsedPane && collapsedPane.props.name])
      });
    }, () => {});
  }

  renderWidget(props: WmAccordionProps) {
    const accordionpanes = props.children;
    const expandedId = this.state.expandedId || 0;
    return (
        <View style={this.styles.root}>
          <List.AccordionGroup expandedId={ expandedId } onAccordionPress={this.onAccordionPress.bind(this)} >
            {accordionpanes
              ? isArray(accordionpanes) && accordionpanes.length
                ? accordionpanes.map((item: any, index: any) => this.renderAccordionpane(item, index, expandedId === index + 1))
                : this.renderAccordionpane(accordionpanes, 0)
              : null}
          </List.AccordionGroup>
        </View>
    );
  }
}
