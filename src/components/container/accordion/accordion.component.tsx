import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Badge } from 'react-native-paper';
import { isArray } from 'lodash';

import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import WmAccordionProps from './accordion.props';
import { DEFAULT_CLASS, WmAccordionStyles } from './accordion.styles';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import WmAccordionpane from './accordionpane/accordionpane.component';
import { isDefined } from '@wavemaker/app-rn-runtime/core/utils';

export class WmAccordionState extends BaseComponentState<WmAccordionProps> {
  lastExpandedIndex = -1;
  isExpanded = [] as boolean[];
}

export default class WmAccordion extends BaseComponent<WmAccordionProps, WmAccordionState, WmAccordionStyles> {
  public accordionPanes = [] as WmAccordionpane[];
  private newIndex = 0;

  constructor(props: WmAccordionProps) {
    super(props, DEFAULT_CLASS, new WmAccordionProps(), new WmAccordionState());
  }

  addAccordionPane(accordionPane: WmAccordionpane) {
    const i = this.accordionPanes.findIndex(t => t.props.title === accordionPane.props.title);
    if (i >= 0) {
      this.accordionPanes[i] = accordionPane;
    } else {
      this.accordionPanes[this.newIndex++] = accordionPane;
    }
    if (!(this.state.isExpanded?.find((v) => v))) {
      this.toggle(this.state.props.defaultpaneindex + 1);
    }
  }

  expand(accordionName: string) {
    const i = this.accordionPanes.findIndex(t => t.props.name === accordionName);
    this.toggle(i + 1, true);
  }

  collapse(accordionName: string) {
    const i = this.accordionPanes.findIndex(t => t.props.name === accordionName);
    this.toggle(i + 1, false);
  }

  expandCollapseIcon(item: any, index: number, showBadge = true, showIcon = true, useChevron = true, isExpanded = false) {
    const widgetProps = item.props;
    //@ts-ignore
    const badge = showBadge && widgetProps.badgevalue != undefined ? (
      <Badge style={[
        this.styles.badge,
        isExpanded ? this.styles.activeBadge: null,
        this.styles[widgetProps.badgetype || 'default']]}
        {...this.getTestProps('badge'+index)}>
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
              id={this.getTestId('icon' + index)}
              styles={this.theme.mergeStyle({}, this.styles.icon, isExpanded ? this.styles.activeIcon : null)}
              name={'expand_collapse_icon'}
              iconclass={iconclass}></WmIcon>): null}
          </View>);
  }

  renderAccordionpane(item: any, index: any, accordionpanes: any[] = []) {
    const showIconOnLeft = this.styles.leftToggleIcon.root.width !== undefined;
    const isExpanded = this.state.isExpanded[index];
    return (
      <View style={this.styles.pane} key={item.props.title}>
        <TouchableOpacity key={'accordionpane_' + (index + 1)}
              {...this.getTestPropsForAction(`header${index}`)}
              style={[this.styles.header,
                index === 0 ? this.styles.firstHeader: null,
                index === accordionpanes.length - 1 && !isExpanded ? this.styles.lastHeader: null,
                isExpanded ? this.styles.activeHeader : {}]}
                onPress={this.toggle.bind(this, index + 1, !isExpanded)}>
          {this.expandCollapseIcon(item, index, false, showIconOnLeft, true, isExpanded)}
          {item.props.iconclass ? <WmIcon styles={this.styles.icon} name={item.props.name + '_icon'} iconclass={item.props.iconclass}></WmIcon>: null}
          <View style={{flexDirection: 'column', flex: 1, justifyContent: 'center'}}>
            <Text style={[
              this.styles.text,
              this.styles.heading,
              isExpanded ? this.styles.activeHeaderTitle : {}]}
              {...this.getTestPropsForAction(`header${index}_title`)}
              accessibilityRole='header'>
                {isDefined(item.props.title) ? item.props.title : 'Title'}
            </Text>
            {item.props.description ? 
              (<Text style={this.styles.subheading}
                {...this.getTestPropsForAction(`header${index}_description`)}>{item.props.description}</Text>) : null }
          </View>
          {this.expandCollapseIcon(item, index, true, !showIconOnLeft, true, isExpanded)}
        </TouchableOpacity>
        {item}
      </View>
    );
  }

  toggle(index: number, expand = true) {
    let expandedId = expand ? index : -1;
    let collapseId = expand ? -1 : index;
    if (expand && this.state.isExpanded[expandedId - 1]
        || !expand && this.state.isExpanded[collapseId - 1] === false) {
        return;
    }
    if (collapseId < 0 && this.state.props.closeothers) {
      collapseId = this.state.lastExpandedIndex;
    }
    const collapsedPane = this.accordionPanes[collapseId -1];
    collapsedPane?.hide();
    Promise.resolve().then(() => {
      const expandedPane = expandedId ? this.accordionPanes[expandedId - 1]: null;
      expandedPane?.show();
      this.setState((state) => {
        if (collapseId > 0 && collapsedPane) {
          state.isExpanded[collapseId - 1] = false;
        }
        if (expandedId > 0 && expandedPane) {
          state.isExpanded[expandedId - 1] = true;
        }
        return {
          lastExpandedIndex: expandedId,
          isExpanded: [...state.isExpanded]
        };
      }, () => {
        this.invokeEventCallback('onChange', [{},
          this.proxy,
          expandedId - 1,
          collapseId ? collapseId - 1 : null,
          expandedPane && expandedPane.props.name,
          collapsedPane && collapsedPane.props.name]);
        });
    }, () => {});
  }

  public componentDidMount(): void {
      super.componentDidMount();
      this.toggle(this.state.props.defaultpaneindex + 1);
  }

  renderWidget(props: WmAccordionProps) {
    const accordionpanes = props.children;
    const expandedId = this.state.lastExpandedIndex || 0;
    return (
        <View style={this.styles.root}>
          {this._background}
            {accordionpanes
              ? isArray(accordionpanes) && accordionpanes.length
                ? accordionpanes.map((item: any, index: any) => this.renderAccordionpane(item, index, accordionpanes))
                : this.renderAccordionpane(accordionpanes, 0)
              : null}
        </View>
    );
  }
}
