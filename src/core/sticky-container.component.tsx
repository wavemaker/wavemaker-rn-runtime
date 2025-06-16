import React, { 
    ReactNode, 
    useContext, 
    RefObject,
    Dispatch,
    SetStateAction,
   } from "react";
  import { ViewStyle, NativeSyntheticEvent, NativeScrollEvent, View, LayoutChangeEvent, LayoutRectangle } from "react-native";
  import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedScrollHandler,
    runOnJS,
    useAnimatedRef,
    ReanimatedEvent,
    ScrollEvent,
  } from "react-native-reanimated";
  import { BaseComponent } from "./base.component";
  import { SharedValue } from 'react-native-reanimated';
  import EventNotifier from "./event-notifier";
  
  interface StickyViewProps {
    style?: any;
    show?: boolean;
    theme?: any;
    usememo?: boolean;
    children?: any;
    renderWidget?: () => ReactNode;
    component?: BaseComponent<any, any, any>;
    onLayout?: (event: any) => void;
  }
  
  interface StickyNavProps extends StickyViewProps {
    styles: ViewStyle
  }
  
  interface StickyHeaderProps extends StickyViewProps {
    styles: ViewStyle
  }
  
  interface StickyViewContainerProps {
    stickyNavAnimateStyle?: any;
    stickyHeaderAnimateStyle?: any;
    children?: ReactNode;
    hasAppnavbar?: boolean;
    onscroll?: string;
  }
  
  export type StickyContextType = {
    stickyNavTranslateY?: SharedValue<number>;
    stickyHeaderTranslateY: SharedValue<number>;
  
    stickyNavAnimateStyle: any;
    stickyHeaderAnimateStyle: any;
    showStickyHeader: SharedValue<boolean>;
  
    navHeight: SharedValue<number>;
    bottomTabHeight: SharedValue<number>;
    pageContentReady: boolean;
    setPageContentReady: Dispatch<SetStateAction<boolean>>;
    scrollY: SharedValue<number>;
    scrollDirection: SharedValue<number>;
  
    onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    onScrollEndDrag: (scrollRef: RefObject<any>) => void;
  };
  
  export type CustomJsScrollEvent = {
    nativeEvent: {
      contentInset: any;
      contentOffset: { x: number; y: number };
      contentSize: any;
      layoutMeasurement: any;
      zoomScale: number;
    };
  };
  
  const StickyViewContext = React.createContext<StickyViewContainer>(null as any);
  export const StickyContext = React.createContext<StickyContextType | undefined>(undefined);
  
  export const useStickyContext = () => {
    const context = useContext(StickyContext);
    if (context) return context;
    return {};
  };
  
  export const ScrollContaineWrapper = ({ children, hasAppnavbar, onscroll }: StickyViewContainerProps) => {
    const scrollY = useSharedValue<number>(0);
    const prevScrollY = useSharedValue<number>(0);
    const scrollVelocity = useSharedValue<number>(0);
    const scrollDirection = useSharedValue<number>(0);
  
    const stickyHeaderTranslateY = useSharedValue<number>(0);
    const stickyNavTranslateY = useSharedValue<number>(0);
    const showStickyHeader = useSharedValue<boolean>(false);
    // Default navbar height from appnavbar styles is 80, maintaining to minimize the navHeight immediate flicker
    const navHeight = useSharedValue<number>(hasAppnavbar && onscroll == 'topnav' ? 80 : 0);
    const bottomTabHeight = useSharedValue<number>(0);
  
    const lastNotifyTime = useSharedValue<number>(0);
    const prevScrollTime = useSharedValue<number>(0);
  
    const [pageContentReady, setPageContentReady] = React.useState(false);
  
    const stickyNavAnimateStyle = useAnimatedStyle(() => {
      return {
        transform: [{ translateY: -stickyNavTranslateY.value }]
      };
    }, [stickyNavTranslateY]);
  
    const stickyHeaderAnimateStyle = useAnimatedStyle(() => {
      const stickyNav = onscroll == 'topnav' ||  onscroll == 'topnav-bottomnav';
      if(stickyNav){
        return {
          transform: [{ translateY: 
            Math.max(
              Math.max(stickyHeaderTranslateY.value - navHeight.value - scrollY.value, - navHeight.value),  
              - stickyNavTranslateY.value
            )
          }],
        }
      }else{
        return {
          transform: [{ translateY: Math.max(stickyHeaderTranslateY.value - scrollY.value, navHeight.value)}]
        }
      }
    }, [scrollY, stickyHeaderTranslateY, navHeight, stickyNavTranslateY]);
  
    const notifyEvent = (event: any)=>{
      EventNotifier.ROOT.notify('scroll', [{nativeEvent: event}]);
    }
  
    const onScroll = useAnimatedScrollHandler({
      onScroll: (event: ReanimatedEvent<ScrollEvent>): void => {
        const y = event.contentOffset?.y;
        const currentScrollTime = Date.now();
  
        const delta = y - prevScrollY.value;
        const delaTime = currentScrollTime - prevScrollTime.value;
        if(delta != 0) scrollDirection.value = delta > 0 ? -1 : 1;
  
        if (Math.abs(delta) >= 0.1){
          prevScrollY.value = y;
          scrollY.value = Math.max(0, y);
  
          showStickyHeader.value = y >= (stickyHeaderTranslateY.value - navHeight.value + stickyNavTranslateY.value);
          stickyNavTranslateY.value = Math.max(Math.min(stickyNavTranslateY.value + delta, navHeight.value), 0);
  
          scrollVelocity.value = Math.abs(delta) / delaTime;
          prevScrollTime.value = currentScrollTime;
        }
  
        if(currentScrollTime - lastNotifyTime.value >= 100){
          lastNotifyTime.value = currentScrollTime;
          const safeEvent = {
            contentOffset: {
              y: event.contentOffset?.y ?? 0,
            },
            contentSize: {
              height: event.contentSize?.height ?? 0,
            },
            layoutMeasurement: {
              height: event.layoutMeasurement?.height ?? 0,
            },
            scrollDirection: scrollDirection.value,
            scrollDelta: delta,
          };
          runOnJS(notifyEvent)(safeEvent);
        }
      }
    });
  
    const onScrollEndDrag = (scrollRef: RefObject<Animated.ScrollView>): void =>{
      const y = scrollY.value;
      if(scrollVelocity.value < 0.3){
        if(scrollDirection.value < 0 && stickyNavTranslateY.value >= (navHeight.value / 9.9)){ // bottom visible
          scrollRef?.current?.scrollTo({ y: y + (navHeight.value - stickyNavTranslateY.value), animated: true })
        } else if( scrollDirection.value > 0 &&  stickyNavTranslateY.value <= (navHeight.value / 1.1)) { // top content visible
          scrollRef?.current?.scrollTo({ y: y - stickyNavTranslateY.value, animated: true })
        }
      }
    }
  
    const contextValue = {
      scrollY,
      scrollDirection,
      stickyNavAnimateStyle,
      stickyHeaderAnimateStyle,
      stickyHeaderTranslateY,
      showStickyHeader,
      navHeight,
      bottomTabHeight, 
      pageContentReady, 
      setPageContentReady,
      onScroll,
      onScrollEndDrag
    };
  
    return (
      <StickyContext.Provider value={contextValue}>
        {children}
      </StickyContext.Provider>
    );
  };
  
  export abstract class StickyView extends React.Component<StickyViewProps> {
    protected abstract renderView(): React.ReactNode;
    cachedComponent: React.ReactNode;
    container: StickyViewContainer = null as any;
    static idCounter = 0;
    id = StickyView.idCounter++;
    layout: LayoutRectangle | null = null;
    static contextType = StickyContext;
  
    constructor(props: StickyViewProps) {
      super(props);
    }
  
    componentWillUnmount() {
      this.container?.remove(this);
    }
  
    componentDidMount() {
      if (this.props.show) {
        this.container.add(this, this.renderView());
      }
    }
  
  
    render() {
      this.cachedComponent = (this.props.usememo === true && this.cachedComponent ) || (
        <StickyViewContext.Consumer>
          {(container) => {
            this.container = container;
            return <></>
          }}
        </StickyViewContext.Consumer>)
        return this.cachedComponent;
      }
  }
  
  export class StickyNav extends StickyView {
    static defaultProps = {
      show: true
    };
    static contextType = StickyContext;
  
    constructor(props: StickyNavProps) {
      super(props);
    }
  
    renderView() {
      return <StickyContext.Consumer>
        {(context) => {
          const { stickyNavAnimateStyle } = context || {};
          return (
            <Animated.View style={[stickyNavAnimateStyle]}
              key={`nav-${this.id}`}
            >
              {this.props.children}
            </Animated.View>
          );
        }}
      </StickyContext.Consumer>
    }
  }
  
  export class StickyHeader extends StickyView {
    static defaultProps = {
      show: true
    };
    static contextType = StickyContext;
  
    constructor(props: StickyHeaderProps) {
      super(props);
    }
    
    renderView() {
      return <StickyContext.Consumer>
        {(context) => {
          const { stickyHeaderAnimateStyle } = context || {};
          return (
            <Animated.View style={[ stickyHeaderAnimateStyle, this.props.style]}
              key={`header-${this.id}`}
            >
              {this.props.children}
            </Animated.View>
          );
        }}
      </StickyContext.Consumer>
    }
  }
  export class StickyViewContainer extends React.Component<StickyViewContainerProps, any, any> {
    children: Map<StickyView, React.ReactNode> = new Map();
    id = 0;
  
    add(c: StickyView, n: React.ReactNode) {
      this.children.set(c, n);
      setTimeout(() => this.setState({ id: ++this.id }));
    }
  
    remove(c: StickyView) {
      this.children.delete(c);
      setTimeout(() => this.setState({ id: ++this.id }));
    }
  
    render() {
      return (
        <StickyViewContext.Provider value={this}>
          <ScrollContaineWrapper hasAppnavbar={this.props.hasAppnavbar} onscroll={this.props.onscroll}>
            {(this.props as any).children}
            <Animated.View style={{ position: 'absolute', width: '100%', zIndex: 10 }}
              pointerEvents={'box-none'}
            >
              {Array.from(this.children.entries()).map(([view, node]) => {
                const element = node as React.ReactElement;
                return React.cloneElement(element, { 
                  key: `sticky-${view.id}`,
                  style: element.props.style
                });
              })}
            </Animated.View>
          </ScrollContaineWrapper>
        </StickyViewContext.Provider>
      );
    }
  }