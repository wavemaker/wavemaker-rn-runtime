import React from 'react';
import { DimensionValue, LayoutChangeEvent, StyleProp, View, ViewStyle, Platform, Animated } from 'react-native';
import WmContainerProps from './container.props';
import { DEFAULT_CLASS, WmContainerStyles } from './container.styles';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import { Animatedview } from '@wavemaker/app-rn-runtime/components/basic/animatedview.component';
import { PartialHost, PartialHostState } from './partial-host.component';
import { createSkeleton } from '../basic/skeleton/skeleton.component';
import { WmSkeletonStyles } from '../basic/skeleton/skeleton.styles';
import { ScrollView } from 'react-native-gesture-handler';
import { StickyWrapperContextType, StickyWrapperContext } from '@wavemaker/app-rn-runtime/core/sticky-wrapper';
import { EdgeInsets, SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { StickyContainer } from '@wavemaker/app-rn-runtime/core/components/sticky-container.component';
import { getParentStyles } from '@wavemaker/app-rn-runtime/core/components/sticky-container.styles';
import injector from '@wavemaker/app-rn-runtime/core/injector';
import AppConfig from '@wavemaker/app-rn-runtime/core/AppConfig';

// Alignment matrix for flex properties
const alignmentMatrixFixed: Record<
  string,
  { justifyContent: string; alignItems: string }
> = {
  'top-left': { justifyContent: 'flex-start', alignItems: 'flex-start' },
  'top-center': { justifyContent: 'center', alignItems: 'flex-start' },
  'top-right': { justifyContent: 'flex-end', alignItems: 'flex-start' },
  'middle-left': { justifyContent: 'flex-start', alignItems: 'center' },
  'middle-center': { justifyContent: 'center', alignItems: 'center' },
  'middle-right': { justifyContent: 'flex-end', alignItems: 'center' },
  'bottom-left': { justifyContent: 'flex-start', alignItems: 'flex-end' },
  'bottom-center': { justifyContent: 'center', alignItems: 'flex-end' },
  'bottom-right': { justifyContent: 'flex-end', alignItems: 'flex-end' },
};

const alignmentMatrixAuto: Record<
  string,
  { justifyContent: string; alignItems: string }
> = {
  start: { justifyContent: 'space-between', alignItems: 'flex-start' },
  center: { justifyContent: 'space-between', alignItems: 'center' },
  end: { justifyContent: 'space-between', alignItems: 'flex-end' },
};

export class WmContainerState extends PartialHostState<WmContainerProps> {
  isPartialLoaded = false;
  stickyContainerVisibility = false;
}

export default class WmContainer extends PartialHost<WmContainerProps, WmContainerState, WmContainerStyles> {
  static contextType = StickyWrapperContext;
  private containerRef: React.RefObject<View>;
  private stickyContainerOpacity: Animated.Value;
  private appConfig = injector.get<AppConfig>('APP_CONFIG');
  insets: EdgeInsets | null = {
    top: 0, bottom: 0, left: 0, right: 0
  };

  constructor(props: WmContainerProps) {
    super(props, DEFAULT_CLASS, new WmContainerProps(), new WmContainerState());
    this.containerRef = React.createRef();
    this.stickyContainerOpacity = new Animated.Value(1);

    this.subscribe('updateStickyHeaders', (_event: any) => {
      if(this.props.sticky){
        setTimeout(()=>{
          this.getStickyHeaderTranslateY();
        }, 500);
      }
    })
  }

  getBackground(): React.JSX.Element | null {
    return this._showSkeleton ? null : this._background
  }
  
  // Compute root style respecting 'fill'|'hug'|<size> for width/height.
  private getRootContainerStyle(): ViewStyle {
    // const { width, height } = this.props;
    const baseStyle = this.styles.root || {};
    const { width, height }: any = baseStyle;
    const dimensionStyle: ViewStyle = {};

    console.log({height, width});

    if (height === 'fill') {
      dimensionStyle.flexGrow = 1;
      // dimensionStyle.flexShrink = 1;
      dimensionStyle.height = undefined;
    } else if (height === 'hug') {
      dimensionStyle.flexGrow = 0;
      dimensionStyle.height = undefined;
    } else if (height) {
      const num = parseFloat(height);
      dimensionStyle.height = (isNaN(num) ? height : num) as DimensionValue;
    }

    if (width === 'fill') {
      dimensionStyle.alignSelf = 'stretch';
      dimensionStyle.width = undefined;
    } else if (width === 'hug') {
      dimensionStyle.width = undefined;
    } else if (width) {
      const num = parseFloat(width);
      dimensionStyle.width = (isNaN(num) ? width : num) as DimensionValue;
    }

    const styleWithResize = {
      ...baseStyle,
      ...dimensionStyle,
    };

    return this._showSkeleton
      ? { ...styleWithResize, ...this.styles.skeleton?.root }
      : styleWithResize;
  }

  // Compute content layout (flexDirection, wrap, gap, justifyContent, alignItems).
  private getContentContainerStyle(): ViewStyle {
    const { direction, wrap, gap, alignment, columngap } = this.props;

    /* Check if any of the new layout props are provided. If not, return an empty
    style object to maintain backward compatibility. */
    const useNewLayoutSystem = 
        direction !== undefined || 
        wrap !== undefined || 
        gap !== undefined || 
        alignment !== undefined ||
        columngap !== undefined;

    if (!useNewLayoutSystem) {
      return {};
    }

    // Apply defaults only if the new layout system is active
    const finalDirection = direction ?? 'row';
    const finalWrap = wrap ?? false;
    const finalGap = gap ?? 4;
    const finalAlignment = alignment ?? 'top-left';

    const isRow = finalDirection === 'row';
    const isAutoGap = finalGap === 'auto';
    const isWrap = finalWrap === 'true' || finalWrap === true;

    const layoutStyle: ViewStyle = {
      flexDirection: finalDirection,
      flexWrap: isWrap && isRow ? 'wrap' : 'nowrap',
    };

    if (isAutoGap) {
      const alignConfig =
        alignmentMatrixAuto[finalAlignment] || alignmentMatrixAuto['start'];
      layoutStyle.justifyContent =
        alignConfig.justifyContent as ViewStyle['justifyContent'];
      layoutStyle.alignItems =
        alignConfig.alignItems as ViewStyle['alignItems'];
    } else {
      if (isRow) {
        // For a row, the main-axis gap (between items) is columnGap.
        layoutStyle.columnGap = Number(finalGap);
      } else {
        // For a column, the main-axis gap (between items) is rowGap.
        layoutStyle.rowGap = Number(finalGap);
      }
      const alignConfig =
        alignmentMatrixFixed[finalAlignment] || alignmentMatrixFixed['top-left'];

      layoutStyle.justifyContent = (
        isRow ? alignConfig.justifyContent : alignConfig.alignItems
      ) as ViewStyle['justifyContent'];
      layoutStyle.alignItems = (
        isRow ? alignConfig.alignItems : alignConfig.justifyContent
      ) as ViewStyle['alignItems'];
    }

    // Add columnGap logic for wrapped rows
    if (isWrap && isRow) {
      if (columngap === 'auto') {
        layoutStyle.alignContent = 'space-between';
      } else if (columngap !== undefined) {
        layoutStyle.rowGap = Number(columngap);
      }
    }

    return {
      ...layoutStyle,
    };
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
  public getStickyHeaderTranslateY(){
    const isEdgeToEdgeApp = !!this.appConfig?.edgeToEdgeConfig?.isEdgeToEdgeApp;
    this.containerRef?.current?.measure((_x = 0, _y = 0, _width = 0, _height = 0, px = 0, py = 0)=>{
      const topInsetsInYposition = (Platform.OS == 'ios' && !isEdgeToEdgeApp) ? (this.insets?.top || 0): 0
      if((this.context) && (this.context as StickyWrapperContextType).stickyContainerTranslateY) {
        (this.context as StickyWrapperContextType).stickyContainerTranslateY.value = py - topInsetsInYposition ;
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

  private renderStickyContent(props: WmContainerProps, dimensions: ViewStyle, styles: ViewStyle, autoLayoutStyle: ViewStyle) {
    const { stickyContainerVisibility } = this.state;
    const { positioningStyles } = getParentStyles(this);

    return (
      <>
        {stickyContainerVisibility ? (
          <StickyContainer
            component={this}
            theme={this.theme}
            style={[
              this.styles.sticky,
              { backgroundColor: styles.backgroundColor }
            ]}
            positionStyles={positioningStyles}
            show={props.show as boolean}
          >
            <View style={[dimensions as ViewStyle, { backgroundColor: styles.backgroundColor }, this.styles.content, autoLayoutStyle]}>
              {this.renderContent(props)}
            </View>
          </StickyContainer>
        ) : <></>}
        <Animated.View 
          style={[
            dimensions as ViewStyle, 
            { opacity: this.stickyContainerOpacity }, 
            this.styles.content,
            autoLayoutStyle
          ]} 
          ref={this.containerRef}
        >
          {this.renderContent(props)}
        </Animated.View>
      </>
    );
  }

  renderWidget(props: WmContainerProps) {
    const rootStyle = this.getRootContainerStyle();
    const autoLayoutStyle = this.getContentContainerStyle();

    const dimensions: ViewStyle = {
      width: rootStyle.width ? '100%' : undefined,
      height: rootStyle.height ? '100%' : undefined
    };

    const styles = this._showSkeleton ? {
      ...this.styles.root,
      ...this.styles.skeleton.root
    } : this.styles.root;

    if (props.sticky) {
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
              style={rootStyle}
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
                {props.sticky ? (
                  this.renderStickyContent(props, dimensions, styles, autoLayoutStyle)
                ) : !props.scrollable ? (
                  <View style={[{
                    flexDirection: 'column'}, 
                    this.getFlexUtilityStyles(), 
                    dimensions as ViewStyle, 
                    this.styles.content,
                    autoLayoutStyle]}>
                    {this.renderContent(props)}
                  </View>
                ) : (
                  <ScrollView 
                    style={[dimensions as ViewStyle, this.styles.content, autoLayoutStyle]}
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
