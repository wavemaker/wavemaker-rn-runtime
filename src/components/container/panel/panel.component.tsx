import React from 'react';
import { Text, View } from 'react-native';
import { Badge, List } from 'react-native-paper';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';

import WmPanelProps from './panel.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmPanelStyles } from './panel.styles';
import { Animatedview } from '@wavemaker/app-rn-runtime/components/basic/animatedview.component';

export class WmPanelState extends BaseComponentState<WmPanelProps> {
  expandedId: any;
  isPartialLoaded = false;
}

export default class WmPanel extends BaseComponent<WmPanelProps, WmPanelState, WmPanelStyles> {
  private animatedRef: any;
  constructor(props: WmPanelProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmPanelProps());
    this.updateState({
      expandedId: this.state.props.expanded ? 1 : -1,
    } as WmPanelState);
  }

  onPartialLoad() {
    this.invokeEventCallback('onLoad', [this]);
  }

  renderContent(props: WmPanelProps) {
    if (props.renderPartial) {
      if (!this.state.isPartialLoaded) {
        setTimeout(() => {
          this.updateState({
            isPartialLoaded: true
          } as WmPanelState);
        });
      }
      return props.renderPartial(this.onPartialLoad.bind(this));
    }
  }

  onPanelPress(expandedId: any) {
    if (!this.state.props.collapsible) {
      return;
    }
    const paneId = expandedId === this.state.expandedId ? -1 : 1;
    const eventName = paneId === 1 ? 'onExpand' : 'onCollapse';

    if (eventName === 'onCollapse') {
      this.animatedRef.triggerExit().then((res: any) => {
        if (res) {
          this.updateState({
            expandedId: paneId,
            props: {
              expanded: false
            }
          } as WmPanelState);
        }
      })
    } else {
      this.updateState({
        expandedId: paneId,
        props: {
          expanded: true
        }
      } as WmPanelState);
    }

    this.invokeEventCallback(eventName, [null, this.proxy]);
  }

  expandCollapseIcon(isExpanded: boolean) {
    const widgetProps = this.state.props;
    //@ts-ignore
    const badge = widgetProps.badgevalue != undefined ? (<Badge style={[this.styles.badge, this.styles[widgetProps.badgetype || 'default']]}>{widgetProps.badgevalue}</Badge>): null;
    const iconclass = isExpanded ? 'wi wi-chevron-up' : 'wi wi-chevron-down';
    const expandCollapseIcon = widgetProps.collapsible ? (<WmIcon name={'expand_collapse_icon'} styles={this.styles.toggleIcon} iconclass={iconclass}></WmIcon>) : null;
    return (<View style={{flexDirection: 'row'}}>{badge}{expandCollapseIcon}</View>);
  }

  renderPanel(props: WmPanelProps) {
    const icon = (<WmIcon styles={this.styles.icon} name={props.name + '_icon'} iconclass={props.iconclass}></WmIcon>);
    return (
      <List.Accordion title={props.title} style={this.styles.header} id={1}
                      titleStyle={this.styles.text} descriptionStyle={this.styles.subheading}
                      description={props.subheading}
                      expanded={props.expanded} 
                      right={({isExpanded}) => this.expandCollapseIcon(isExpanded)} left={props => icon}>
        <Animatedview style={{marginLeft: -64}} ref={ref => this.animatedRef = ref} entryanimation={'fadeInDown'}>
          <View>{this.renderContent(props)}</View>
          <View>{props.children}</View>
        </Animatedview>
      </List.Accordion>
    );
  }

  renderWidget(props: WmPanelProps) {
    return (<View style={this.styles.root}>
                  <List.AccordionGroup expandedId={this.state.expandedId} onAccordionPress={this.onPanelPress.bind(this)}>
                      <Animatedview entryanimation={props.animation}>
                        {this.renderPanel(props)}
                      </Animatedview>
                  </List.AccordionGroup>
            </View>);
  }
}
