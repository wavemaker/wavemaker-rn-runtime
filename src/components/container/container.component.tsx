import React from 'react';
import { LayoutChangeEvent, View, ViewStyle, Platform, Animated } from 'react-native';
import WmContainerProps from './container.props';
import { DEFAULT_CLASS, WmContainerStyles } from './container.styles';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import { Animatedview } from '@wavemaker/app-rn-runtime/components/basic/animatedview.component';
import { PartialHost, PartialHostState } from './partial-host.component';
import { createSkeleton } from '../basic/skeleton/skeleton.component';
import { WmSkeletonStyles } from '../basic/skeleton/skeleton.styles';
import { ScrollView } from 'react-native-gesture-handler';
import { StickyContextType, StickyContext, StickyHeader } from '@wavemaker/app-rn-runtime/core/sticky-container.component';
import { EdgeInsets, SafeAreaInsetsContext } from 'react-native-safe-area-context';
import EventNotifier from '@wavemaker/app-rn-runtime/core/event-notifier';

export class WmContainerState extends PartialHostState<WmContainerProps> {
  isPartialLoaded = false;
  stickyContainerVisibility = false;
}

export default class WmContainer extends PartialHost<WmContainerProps, WmContainerState, WmContainerStyles> {
  static contextType = StickyContext;
  private containerRef: React.RefObject<View>;
  private stickyContainerOpacity: Animated.Value;
  insets: EdgeInsets | null = {
    top: 0, bottom: 0, left: 0, right: 0
  };

  constructor(props: WmContainerProps) {
    super(props, DEFAULT_CLASS, new WmContainerProps(), new WmContainerState());
    this.containerRef = React.createRef();
    this.stickyContainerOpacity = new Animated.Value(1);

    EventNotifier.ROOT.subscribe('updateStickyHeaders', (_event: any) => {
      if(this.props.issticky){
        setTimeout(()=>{
          this.getStickyHeaderTranslateY();
        }, 500);
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

  public getStickyHeaderTranslateY(){
    const { stickyHeaderTranslateY } = this.context as StickyContextType;
    this.containerRef?.current?.measure((_x = 0, _y = 0, _width = 0, _height = 0, px = 0, py = 0)=>{
      const topInsetsInYposition = Platform.OS == 'ios' ? (this.insets?.top || 0): 0
      if(stickyHeaderTranslateY) {
        stickyHeaderTranslateY.value = py - topInsetsInYposition ;
        this.updateState({ stickyContainerVisibility: true} as WmContainerState);     
      }
    })
  }

  componentDidUpdate(_prevProps: any, prevState: any) {
    if (prevState.stickyContainerVisibility !== this.state.stickyContainerVisibility) {
      Animated.timing(this.stickyContainerOpacity, {
        toValue: this.state.stickyContainerVisibility ? 0 : 1,
        delay: 500,
        useNativeDriver: true
      }).start();
    }
  }

  private renderStickyContent(props: WmContainerProps, dimensions: ViewStyle, styles: ViewStyle) {
    const { stickyContainerVisibility } = this.state;
    return (
      <>
        {stickyContainerVisibility ? (
          <StickyHeader
            component={this}
            theme={this.theme}
            style={[dimensions, this.styles.sticky]}
          >
            <View style={[dimensions as ViewStyle, { backgroundColor: styles.backgroundColor }, this.styles.content]}>
              {this.renderContent(props)}
            </View>
          </StickyHeader>
        ) : <></>}
        <Animated.View 
          style={[
            dimensions as ViewStyle, 
            { opacity: this.stickyContainerOpacity }, 
            this.styles.content
          ]} 
          ref={this.containerRef}
        >
          {this.renderContent(props)}
        </Animated.View>
      </>
    );
  }

  renderWidget(props: WmContainerProps) {
    const dimensions: ViewStyle = {
      width: this.styles.root.width ? '100%' : undefined,
      height: this.styles.root.height ? '100%' : undefined
    };

    const styles = this._showSkeleton ? {
      ...this.styles.root,
      ...this.styles.skeleton.root
    } : this.styles.root;

    if (props.issticky) {
      this.isSticky = true;
    }
    return (
      <SafeAreaInsetsContext.Consumer>
        {(insets = { top: 0, bottom: 0, left: 0, right: 0 }) => {
          this.insets = insets;
          return (
            <Animatedview 
              entryanimation={props.animation} 
              delay={props.animationdelay} 
              style={styles}
              onLayout={(event: LayoutChangeEvent, ref: React.RefObject<View>) => {
                this.handleLayout(event, ref);
              }}
            >
              {this.getBackground()}
              <Tappable 
                {...this.getTestPropsForAction()} 
                target={this} 
                styles={dimensions} 
                disableTouchEffect={this.state.props.disabletoucheffect}
              >
                {props.issticky ? (
                  this.renderStickyContent(props, dimensions, styles)
                ) : !props.scrollable ? (
                  <View style={[dimensions as ViewStyle, this.styles.content]}>
                    {this.renderContent(props)}
                  </View>
                ) : (
                  <ScrollView 
                    style={[dimensions as ViewStyle, this.styles.content]}
                    onScroll={(event) => this.notify('scroll', [event])}
                    scrollEventThrottle={48}
                  >
                    {this.renderContent(props)}
                  </ScrollView>
                )}
              </Tappable>
            </Animatedview>
          );
        }}
      </SafeAreaInsetsContext.Consumer>
    );
  }
}
