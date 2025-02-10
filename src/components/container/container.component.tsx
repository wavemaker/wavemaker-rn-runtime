import React from 'react';
import { ColorValue, View, ViewStyle, Button } from 'react-native';

import WmContainerProps from './container.props';
import { DEFAULT_CLASS, WmContainerStyles } from './container.styles';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import { Animatedview } from '@wavemaker/app-rn-runtime/components/basic/animatedview.component';
import { PartialHost, PartialHostState } from './partial-host.component';
import { createSkeleton } from '../basic/skeleton/skeleton.component';
import { WmSkeletonStyles } from '../basic/skeleton/skeleton.styles';
import { ScrollView } from 'react-native-gesture-handler';
import { FixedView } from '@wavemaker/app-rn-runtime/core/fixed-view.component';
import { StickyHeigtConsumer, StickyHeight } from '@wavemaker/app-rn-runtime/core/sticky-view.context';

export class WmContainerState extends PartialHostState<WmContainerProps> {
  isPartialLoaded = false;
  isStickyVisible = false;
}

export default class WmContainer extends PartialHost<WmContainerProps, WmContainerState, WmContainerStyles> {
  public stickyHeight: StickyHeight;
  public destroyScrollListner: Function = null as any;
  
  constructor(props: WmContainerProps) {
    super(props, DEFAULT_CLASS, new WmContainerProps(), new WmContainerState());
    this.stickyHeight = new StickyHeight();
  }

  onPropertyChange(name: string, $new: any, $old: any): void {
    super.onPropertyChange(name, $new, $old);
      switch(name) {
        case 'issticky': {
          this.destroyScrollListner && this.destroyScrollListner();
          if ($new) {
            this.listenScrollEvent();
          }
        }
      }
  }


  listenScrollEvent(): void {
    this.destroyScrollListner && this.destroyScrollListner();
    this.destroyScrollListner = this.subscribe('scroll', (e: any) => {
      const scrollPosition = e.nativeEvent.contentOffset.y;
      const yPosition = this.getLayoutOfWidget();
      const isStickyVisible = scrollPosition > yPosition;
      if (this.state.isStickyVisible !== isStickyVisible) {
        this.setState({ 
          isStickyVisible : isStickyVisible
        })
      }
    })
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


  renderWidget(props: WmContainerProps) {
    const dimensions = {
      width: this.styles.root.width ? '100%' : undefined,
      height: this.styles.root.height ? '100%' : undefined
    };

    const styles = this._showSkeleton ? {
      ...this.styles.root,
      ...this.styles.skeleton.root
    } : this.styles.root

    return (
      <Animatedview entryanimation={props.animation} delay={props.animationdelay} style={styles}>
        {this.getBackground()}
        <Tappable {...this.getTestPropsForAction()} target={this} styles={dimensions} disableTouchEffect={this.state.props.disabletoucheffect}>
          { props.issticky && this.state.isStickyVisible ? 
            (<FixedView 
                style={{...styles, ...{top: 0}}} 
                theme={this.theme}>
                {this.renderContent(props)}
              </FixedView>) : null }
            {!props.scrollable ? <View style={[dimensions as ViewStyle,  this.styles.content]}>{this.renderContent(props)}</View> : 
            <ScrollView style={[dimensions as ViewStyle,  this.styles.content]}
            onScroll={(event) => {this.notify('scroll', [event])}}
            scrollEventThrottle={48}>
            {this.renderContent(props)}
          </ScrollView>}
        </Tappable>
      </Animatedview>
    );
  }
}
