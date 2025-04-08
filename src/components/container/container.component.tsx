import React from 'react';
import { ColorValue, LayoutChangeEvent, View, ViewStyle } from 'react-native';

import WmContainerProps from './container.props';
import { DEFAULT_CLASS, WmContainerStyles } from './container.styles';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import { Animatedview } from '@wavemaker/app-rn-runtime/components/basic/animatedview.component';
import { PartialHost, PartialHostState } from './partial-host.component';
import { createSkeleton } from '../basic/skeleton/skeleton.component';
import { WmSkeletonStyles } from '../basic/skeleton/skeleton.styles';
import { ScrollView } from 'react-native-gesture-handler';
import { StickyView } from '@wavemaker/app-rn-runtime/core/sticky-container.component';

export class WmContainerState extends PartialHostState<WmContainerProps> {
  isPartialLoaded = false;
}

export default class WmContainer extends PartialHost<WmContainerProps, WmContainerState, WmContainerStyles> {
  constructor(props: WmContainerProps) {
    super(props, DEFAULT_CLASS, new WmContainerProps(), new WmContainerState());
  }

  getBackground(): React.JSX.Element | null {
    return this._showSkeleton ? null : this._background
  } 
  
  public renderSkeleton(props: WmContainerProps): React.ReactNode {
      if(!props.showskeletonchildren) {
        const dimensions = {
          width: this.styles.root.width ? '100%' : undefined,
          height: this.styles.root.height ? '100%' : undefined
        };    
        const skeletonStyles: WmSkeletonStyles = this.props?.styles?.skeleton || { root: {}, text: {}  } as WmSkeletonStyles
        return createSkeleton(this.theme, skeletonStyles, {
          ...this.styles.root
        }, (<View style={[this.styles.root, { opacity: 0 }]}>
                  <Tappable {...this.getTestPropsForAction()} target={this} styles={dimensions} disableTouchEffect={this.state.props.disabletoucheffect}>
            <View style={[dimensions as ViewStyle,  this.styles.content]}>{this.renderContent(props)}</View>
        </Tappable>

        </View>))
      }
      return null;
    }

    getFlexUtilityStyles() {
      return {
        flexDirection: this.styles.root.flexDirection,
        justifyContent: this.styles.root.justifyContent,
        alignContent: this.styles.root.alignContent,
        alignItems: this.styles.root.alignItems,
        alignSelf: this.styles.root.alignSelf,
        flexShrink: this.styles.root.flexShrink,
        flexGrow: this.styles.root.flexGrow,
        flexWrap: this.styles.root.flexWrap,
        textAlign: this.styles.root.textAlign,
      };
    }

  renderWidget(props: WmContainerProps) {
    const dimensions = {
      width: this.styles.root.width ? '100%' : undefined,
      height: this.styles.root.height ? '100%' : undefined
    };

    const styles = this._showSkeleton ? {
      ...this.styles.root,
      ...this.styles.skeleton.root
    } : this.styles.root
    if(props.issticky) this.isSticky = true;
    return (
      <Animatedview 
        entryanimation={props.animation} 
        delay={props.animationdelay} 
        style={styles}
        onLayout={(event: LayoutChangeEvent, ref: React.RefObject<View>) => this.handleLayout(event, ref)}
      >
        {this.getBackground()}
        <Tappable {...this.getTestPropsForAction()} target={this} styles={dimensions} disableTouchEffect={this.state.props.disabletoucheffect}>
          { props.issticky ? 
            <StickyView
              component={this}
              style={this.styles.sticky}
              theme={this.theme}>
               <View style={styles}>
                  {this.renderContent(props)}
              </View>
            </StickyView>
            : !props.scrollable ? <View   
                style={[{
                flexDirection: 'column'}, 
                this.getFlexUtilityStyles(),
                dimensions as ViewStyle,  
                this.styles.content]}>{this.renderContent(props)}</View> : 
              <ScrollView style={[{
                  flexDirection: 'column'}, 
                  this.getFlexUtilityStyles(),
                  dimensions as ViewStyle,  
                  this.styles.content]}
                onScroll={(event) => {this.notify('scroll', [event])}}
                scrollEventThrottle={48}>
              {this.renderContent(props)}
            </ScrollView>
          }
        </Tappable>
      </Animatedview>
    );
  }
}
