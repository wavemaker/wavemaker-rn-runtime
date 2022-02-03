import React from 'react';
import { Text, View } from 'react-native';
import { Badge, List } from 'react-native-paper';
import { isArray } from 'lodash';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import { isDefined } from '@wavemaker/app-rn-runtime/core/utils';

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

  expandCollapseIcon(props: any, item: any, showBadge = true, showIcon = true, useChevron = true, isExpanded = false) {
    const widgetProps = item.props;
    //@ts-ignore
    const badge = showBadge && widgetProps.badgevalue != undefined ? (
      <Badge style={[
        this.styles.badge,
        isExpanded ? this.styles.activeBadge: null,
        this.styles[widgetProps.badgetype || 'default']]}>
        {widgetProps.badgevalue}
      </Badge>): null;
    let iconclass = null;
    if (useChevron) {
      iconclass = isExpanded ? 'wi wi-chevron-down' : 'wi wi-chevron-up';
    } else {
      iconclass = isExpanded ? 'wi wi-minus' : 'wi wi-plus';
    }
    return (<View style={{flexDirection: 'row'}}>
            {badge}
            {showIcon ? (
              <WmIcon
              styles={this.theme.mergeStyle({}, this.styles.icon, isExpanded ? this.styles.activeIcon : null)}
              name={'expand_collapse_icon'}
              iconclass={iconclass}></WmIcon>): null}
          </View>);
  }

  renderAccordionpane(item: any, index: any, isExpanded = true, accordionpanes: any[] = []) {
    const showIconOnLeft = this.styles.leftToggleIcon.root.width !== undefined;
    return (
      <View style={this.styles.pane}>
        <List.Accordion title={isDefined(item.props.title) ? item.props.title : 'Title'}
                        style={[
                          this.styles.header,
                          index === 0 ? this.styles.firstHeader: null,
                          index === accordionpanes.length - 1 && !isExpanded ? this.styles.lastHeader: null,
                          isExpanded ? this.styles.activeHeader : {}]}
                        theme={{
                          colors: {
                            background : this.styles.header.backgroundColor as string,
                            primary: this.styles.activeHeader.color as string
                          }
                        }}
                        titleStyle={[this.styles.text, isExpanded ? this.styles.activeHeaderTitle : {}]}
                        descriptionStyle={this.styles.subheading}
                        description={item.props.subheading}
                        id={index + 1}
                        key={'accordionpane_' + index}
                        right={props => this.expandCollapseIcon(props, item, true, !showIconOnLeft, true, isExpanded)}
                        left={props => this.expandCollapseIcon(props, item, false, showIconOnLeft, false, isExpanded)}>
            <Animatedview style={{marginLeft: -64}} ref={ref => this.animatedRef = ref} entryanimation={this.state.props.animation}>{item}</Animatedview>
        </List.Accordion>
      </View>
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
                ? accordionpanes.map((item: any, index: any) => this.renderAccordionpane(item, index, expandedId === index + 1, accordionpanes))
                : this.renderAccordionpane(accordionpanes, 0)
              : null}
          </List.AccordionGroup>
        </View>
    );
  }
}
