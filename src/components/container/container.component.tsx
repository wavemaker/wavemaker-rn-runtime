import React from 'react';
import { ColorValue, DimensionValue, LayoutChangeEvent, StyleProp, View, ViewStyle } from 'react-native';

import WmContainerProps from './container.props';
import { DEFAULT_CLASS, WmContainerStyles } from './container.styles';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import { Animatedview } from '@wavemaker/app-rn-runtime/components/basic/animatedview.component';
import { PartialHost, PartialHostState } from './partial-host.component';
import { createSkeleton } from '../basic/skeleton/skeleton.component';
import { WmSkeletonStyles } from '../basic/skeleton/skeleton.styles';
import { ScrollView } from 'react-native-gesture-handler';
import { StickyView } from '@wavemaker/app-rn-runtime/core/sticky-container.component';

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
}

export default class WmContainer extends PartialHost<WmContainerProps, WmContainerState, WmContainerStyles> {
  constructor(props: WmContainerProps) {
    super(props, DEFAULT_CLASS, new WmContainerProps(), new WmContainerState());
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
    const { direction, wrap, gap, alignment } = this.props;

    /* Check if any of the new layout props are provided. If not, return an empty
    style object to maintain backward compatibility. */
    const useNewLayoutSystem = 
        direction !== undefined || 
        wrap !== undefined || 
        gap !== undefined || 
        alignment !== undefined;

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

    const layoutStyle: ViewStyle = {
      flexDirection: finalDirection,
      flexWrap: finalWrap && isRow ? 'wrap' : 'nowrap',
    };

    if (isAutoGap) {
      const alignConfig =
        alignmentMatrixAuto[finalAlignment] || alignmentMatrixAuto['start'];
      layoutStyle.justifyContent =
        alignConfig.justifyContent as ViewStyle['justifyContent'];
      layoutStyle.alignItems =
        alignConfig.alignItems as ViewStyle['alignItems'];
    } else {
      layoutStyle.gap = Number(finalGap);
      const alignConfig =
        alignmentMatrixFixed[finalAlignment] || alignmentMatrixFixed['top-left'];

      layoutStyle.justifyContent = (
        isRow ? alignConfig.justifyContent : alignConfig.alignItems
      ) as ViewStyle['justifyContent'];
      layoutStyle.alignItems = (
        isRow ? alignConfig.alignItems : alignConfig.justifyContent
      ) as ViewStyle['alignItems'];
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

  renderWidget(props: WmContainerProps) {
    const rootStyle = this.getRootContainerStyle();
    const autoLayoutStyle = this.getContentContainerStyle();

    const dimensions = {
      width: rootStyle.width ? '100%' : undefined,
      height: rootStyle.height ? '100%' : undefined
    };

    const contentStyle: StyleProp<ViewStyle>[] = [
      { flexDirection: 'column' },
      this.getFlexUtilityStyles(),
      dimensions as ViewStyle, 
      this.styles.content,
      autoLayoutStyle
    ];

    const styles = this._showSkeleton ? {
      ...this.styles.root,
      ...this.styles.skeleton.root
    } : this.styles.root
    if(props.issticky) this.isSticky = true;
    return (
      <Animatedview 
        entryanimation={props.animation} 
        delay={props.animationdelay} 
        style={rootStyle}
        onLayout={(event: LayoutChangeEvent, ref: React.RefObject<View>) => this.handleLayout(event, ref)}
      >
        {this.getBackground()}
        <Tappable {...this.getTestPropsForAction()} target={this} styles={dimensions} disableTouchEffect={this.state.props.disabletoucheffect}>
          { props.issticky ? 
            <StickyView
              component={this}
              style={this.styles.sticky}
              theme={this.theme}>
               <View style={rootStyle}>
                  {this.renderContent(props)}
              </View>
            </StickyView>
            : !props.scrollable ? <View   
                style={contentStyle}>{this.renderContent(props)}</View> : 
              <ScrollView style={contentStyle}
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
