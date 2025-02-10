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
  stickyHeaderPositionUpdated = false;
  isHeaderVisible = false;
}

export default class WmContainer extends PartialHost<WmContainerProps, WmContainerState, WmContainerStyles> {
  private previosScrollPosition: number = 0;
  private headerHeight: any = 0;
  public stickyHeight: StickyHeight;
  
  constructor(props: WmContainerProps) {
    super(props, DEFAULT_CLASS, new WmContainerProps(), new WmContainerState());
    this.stickyHeight = new StickyHeight();
  }


  getStickyHeaderPosition(props: any){

    if(props.issticky){
      console.log(props.name, 'for sticky prop name==')
      const stickyHeaderPosition = this.getLayoutOfWidget('feedsandEventsButtonsContainer') || 0
      console.log(props.issticky, stickyHeaderPosition, 'inside props.issticky')
      // if(!this.state.stickyHeaderPositionUpdated) {
        this.stickyHeight.setStickyPosition(stickyHeaderPosition)
        // this.setState({stickyHeaderPositionUpdated : true})
      // }
    }
  
    // if(props.issticky) {
    //   console.log(props.name,this.getLayoutOfWidget(props.name), 'c2 position===')
    //   const stickyHeaderPosition = this.getLayoutOfWidget(props.name) || 1
    //   console.log(stickyHeaderPosition, 'stickyHeaderPosition log')
    //   // this.stickyHeaderPositionUpdated = true
    //   this.stickyHeight.setStickyPosition(stickyHeaderPosition)
    //   // this.setState({ stickyHeaderPositionUpdated: true})
    // }

    // if(props.isheader){
    //   console.log(this.getLayoutHeightOfWidget(props.name), 'c1 height===')
    //   this.headerHeight = this.getLayoutHeightOfWidget(props.name)
    // }
  }

  componentDidMount(): void {

    this.subscribe('scroll', (e: any) => {
      const scrollPosition = e.nativeEvent.contentOffset.y
      const scrollUp = scrollPosition > this.previosScrollPosition
      const scrollDown = scrollPosition < this.previosScrollPosition

      if(scrollUp && scrollPosition >= 50){
        this.setState({ 
          isStickyVisible : true, 
          isHeaderVisible : false
        })
      } 
      if(scrollDown && (scrollPosition <= 50)) {
          this.setState({ 
            isStickyVisible : scrollPosition + 
            // this.stickyHeight.getHeaderHeight()
            50
             > 50,
          })
        }
        if(scrollDown && scrollPosition > 50){
          this.setState({ isHeaderVisible : true})
        }
        if(scrollPosition <=0) {
          this.setState({
            isStickyVisible: false, 
            isHeaderVisible: false
          })
        }

      this.previosScrollPosition = scrollPosition
    })
  }

  componentDidUpdate(prevProps: Readonly<WmContainerProps>): void {
    if(!this.state.stickyHeaderPositionUpdated) this.getStickyHeaderPosition(prevProps)
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
    // const isHeader = props.isheader;

    // if(isHeader != undefined && isHeader) {
    //   console.log(isHeader, styles, 'styles===')
    //   this.headerHeight = styles.height
    // }
    // console.log(this.headerHeight, 'this.headerHeight==')

    console.log(this.stickyHeight.getTest(), 'getTest value==')

    return (
      <Animatedview entryanimation={props.animation} delay={props.animationdelay} style={styles}>
        {this.getBackground()}
        <Tappable {...this.getTestPropsForAction()} target={this} styles={dimensions} disableTouchEffect={this.state.props.disabletoucheffect}>
          <StickyHeigtConsumer>
          {(stickHeight)=>{
            const headerHeight = Number(styles.height) || 0
            props.isheader ? stickHeight.setHeaderHeight(headerHeight) : null
            props.isheader ? stickHeight.setTest(props.name || 'default'): null
            return <>
              {props.isheader && this.state.isHeaderVisible && <FixedView style={{...styles, ...{
              }}} theme={this.theme}>{this.renderContent(props)}</FixedView>}
              { props.issticky && this.state.isStickyVisible && <FixedView style={{...styles, ...{
                top: this.state.isHeaderVisible ? 50 : stickHeight.getStickyPosition(),
              }}} theme={this.theme}>{this.renderContent(props)}</FixedView> }
            </>}}
          </StickyHeigtConsumer>

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
