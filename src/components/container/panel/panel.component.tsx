import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { isUndefined } from 'lodash';
import { Badge } from 'react-native-paper';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';

import WmPanelProps from './panel.props';
import { DEFAULT_CLASS, WmPanelStyles } from './panel.styles';
import { isWebPreviewMode } from '@wavemaker/app-rn-runtime/core/utils';
import { CollapsiblePane } from './collapsible-pane.component';
import { WmSkeletonStyles } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.styles';
import { createSkeleton } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.component';
import WmLabel from '@wavemaker/app-rn-runtime/components/basic/label/label.component';

export class WmPanelState extends BaseComponentState<WmPanelProps> {
  isPartialLoaded = false;
}

export default class WmPanel extends BaseComponent<WmPanelProps, WmPanelState, WmPanelStyles> {
  constructor(props: WmPanelProps) {
    super(props, DEFAULT_CLASS, new WmPanelProps());
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
      return props.renderPartial(props, this.onPartialLoad.bind(this));
    }
  }

  onPanelPress() {
    if (!this.state.props.collapsible) {
      return;
    }
    const eventName = this.state.props.expanded ? 'onCollapse' : 'onExpand';
    this.updateState({
      props: {
        expanded: !this.state.props.expanded
      }
    } as WmPanelState);

    this.invokeEventCallback(eventName, [null, this.proxy]);
  }

  expandCollapseIcon(isExpanded: boolean) {
    const widgetProps = this.state.props;
    //@ts-ignore
    const badge = widgetProps.badgevalue != undefined ? (<Badge style={[this.styles.badge, this.styles[widgetProps.badgetype || 'default']]} {...this.getTestProps('badge')}>{widgetProps.badgevalue}</Badge>): null;
    const iconclass = isExpanded ? 'wi wi-chevron-up' : 'wi wi-chevron-down';
    const expandCollapseIcon = widgetProps.collapsible ? (<WmIcon id={this.getTestId('collapseicon')} name={'expand_collapse_icon'} styles={this.styles.toggleIcon} iconclass={iconclass}></WmIcon>) : null;
    return (<View style={{flexDirection: 'row', alignItems: 'center'}}>{badge}{expandCollapseIcon}</View>);
  }

  renderHeader() {
    const props = this.state.props;
    return (
      <TouchableOpacity
        {...this.getTestPropsForAction(`header`)}
        style={[this.styles.header]}
        onPress={this.onPanelPress.bind(this)}
        accessibilityRole='header'>
      {props.iconclass || props.iconurl ? 
        <WmIcon styles={this.styles.icon}
        id={this.getTestId('icon')} 
        name={props.name + '_icon'}
        iconclass={props.iconclass}
        iconheight={props.iconheight}
        iconwidth={props.iconwidth}
        iconmargin={props.iconmargin}
        iconurl={props.iconurl}
        /> : null}
        <View style={{flexDirection: 'column', flex: 1, justifyContent: 'center'}}>
          {
            this._showSkeleton ? 
            <WmLabel 
            showskeleton={true}
            styles={{root: [
              this.styles.text,
              this.styles.heading]}} caption={isUndefined(props.title) ? 'Title' : props.title}/> : 
            <Text style={[
              this.styles.text,
              this.styles.heading]}
              {...this.getTestPropsForAction(`header_title`)}>
                {isUndefined(props.title) ? 'Title' : props.title}
            </Text>
          }
          {props.subheading ? 
            (this._showSkeleton ? 
            <WmLabel  
              showskeleton={true} 
              styles={{root: this.styles.subheading}} 
              caption={props.subheading} /> :
             <Text 
               style={this.styles.subheading}
              {...this.getTestPropsForAction(`subheader`)}>
                {props.subheading}
              </Text> ) : null }
        </View>
        {this.expandCollapseIcon(props.expanded)}
      </TouchableOpacity>
    );
  }

  renderPane(content: React.ReactNode) {
    const expanded = this.state.props.expanded;
    return isWebPreviewMode() || this.styles.header.display == "none" ? 
      (<View style={expanded ? {} : {maxHeight: 0, overflow: 'hidden'}}>
        {content}
      </View>) :
      (<CollapsiblePane close={!expanded}>
        {content}
      </CollapsiblePane>);
  }

  protected getBackground(): React.JSX.Element | null {
    return this._showSkeleton ? null : this._background
  } 
  
  public renderSkeleton(props: WmPanelProps): React.ReactNode {
      if(!props.showskeletonchildren) {
        const skeletonStyles: WmSkeletonStyles = this.props?.styles?.skeleton || { root: {}, text: {}  } as WmSkeletonStyles
        return createSkeleton(this.theme, skeletonStyles, {
          ...this.styles.root
        }, (<View style={[this.styles.root, { opacity: 0 }]}>
                {this.renderHeader()}
                {this.renderPane((
                  <>
                  {this.renderContent(props)}
                  <View>{props.children}</View>
                  </>
                ))}
        </View>))
      }
      return null;
    }

  renderWidget(props: WmPanelProps) {
    const styles = this._showSkeleton ? {
      ...this.styles.root,
      ...this.styles.skeleton.root
    } : this.styles.root
    return (
    <View 
      style={styles} 
      testID={this.getTestId()} 
      onLayout={(event) => this.handleLayout(event)}
    >
      {this.getBackground()}
      {this.renderHeader()}
      {this.renderPane((
        <>
        {this.renderContent(props)}
        <View>{props.children}</View>
        </>
      ))}
    </View>);
  }
}
