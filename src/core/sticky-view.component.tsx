import React, { 
  ReactNode, 
  useContext, 
  RefObject,
  Dispatch,
  SetStateAction,
 } from "react";
import { ViewStyle, NativeSyntheticEvent, NativeScrollEvent, LayoutRectangle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  runOnJS,
  ReanimatedEvent,
  ScrollEvent,
  AnimatedStyle,
} from "react-native-reanimated";
import { BaseComponent, BaseComponentState, BaseProps, BaseStyles } from "./base.component";
import { SharedValue } from 'react-native-reanimated';
import EventNotifier from "./event-notifier";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppConfig from '@wavemaker/app-rn-runtime/core/AppConfig';
import injector from '@wavemaker/app-rn-runtime/core/injector';

interface StickyBaseViewProps {
  style?: ViewStyle[];
  show?: boolean;
  theme?: any;
  usememo?: boolean;
  children?: any;
  renderView?: () => ReactNode;
  component?: BaseComponent<BaseProps, BaseComponentState<any>, BaseStyles>;
}

interface StickyNavProps extends StickyBaseViewProps {}

interface StickyContainerProps extends StickyBaseViewProps {}

interface StickyViewComponentsProps {
  stickyNavAnimateStyle?: AnimatedStyle;
  stickyContainerAnimateStyle?: AnimatedStyle;
  children?: ReactNode;
  hasAppnavbar?: boolean;
  onscroll?: string;
  notifier: EventNotifier;
}

export type StickyWrapperContextType = {
  stickyNavTranslateY?: SharedValue<number>;
  stickyContainerTranslateY: SharedValue<number>;

  stickyNavAnimateStyle: AnimatedStyle;
  stickyContainerAnimateStyle: AnimatedStyle;

  navHeight: SharedValue<number>;
  bottomTabHeight: SharedValue<number>;
  scrollDirection: SharedValue<number>;

  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onScrollEndDrag: (scrollRef: RefObject<Animated.ScrollView>) => void;
};

export type CustomJsScrollEvent = {
  contentOffset: { y: number };
  contentSize: { height: number};
  layoutMeasurement: { height: number};
  scrollDirection: number;
  scrollDelta: number;
};

// StyickyComponentContext is used for the UI, stickyNav & stickyContainer components will be attached here.
const StickyComponentsContext = React.createContext<StickyViewComponents>(null as any);

// StickyWrapperContext is used for the usage & passing of hooks in StickyWrapper(functional component) to childrens.
export const StickyWrapperContext = React.createContext<StickyWrapperContextType | undefined>(undefined);

export const StickyWrapper = ({ children, hasAppnavbar, onscroll, notifier }: StickyViewComponentsProps) => {
  const appConfig = injector.get<AppConfig>('APP_CONFIG');
  const scrollY = useSharedValue<number>(0);
  const prevScrollY = useSharedValue<number>(0);
  const scrollVelocity = useSharedValue<number>(0);
  const scrollDirection = useSharedValue<number>(0);

  const stickyContainerTranslateY = useSharedValue<number>(0);
  const stickyNavTranslateY = useSharedValue<number>(0);

  // Default navbar height from appnavbar styles is 80, maintaining this to minimize the navHeight immediate flicker (in page-content paddingTop)
  const insets = useSafeAreaInsets();
  const insetsVal = appConfig?.edgeToEdgeConfig?.isEdgeToEdgeApp ? insets?.top : 0;
  const navHeight = useSharedValue<number>(hasAppnavbar && (onscroll == 'topnav' || onscroll == 'topnav-bottomnav') ? (80 + insetsVal) : 0);
  const bottomTabHeight = useSharedValue<number>(0);

  const lastNotifyTime = useSharedValue<number>(0);
  const prevScrollTime = useSharedValue<number>(0);

  const stickyNavAnimateStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: -stickyNavTranslateY.value }]
    };
  }, [stickyNavTranslateY]);

  const stickyContainerAnimateStyle = useAnimatedStyle(() => {
    const stickyNav = onscroll == 'topnav' ||  onscroll == 'topnav-bottomnav';
    if(stickyNav){
      return {
        transform: [{ translateY: 
          Math.max(
            Math.max(stickyContainerTranslateY.value - navHeight.value - scrollY.value, - navHeight.value),  
            - stickyNavTranslateY.value
          )
        }],
      }
    }else{
      return {
        transform: [{ translateY: Math.max(stickyContainerTranslateY.value - scrollY.value, navHeight.value)}]
      }
    }
  }, [scrollY, stickyContainerTranslateY, navHeight, stickyNavTranslateY]);

  const notifyEvent = (event: CustomJsScrollEvent)=>{
    if(notifier) {
      notifier.notify('scroll', [{nativeEvent: event}]);
    }
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
    scrollDirection,
    stickyNavAnimateStyle,
    stickyContainerAnimateStyle,
    stickyContainerTranslateY,
    navHeight,
    bottomTabHeight, 
    onScroll,
    onScrollEndDrag
  };

  return (
    <StickyWrapperContext.Provider value={contextValue}>
      {children}
    </StickyWrapperContext.Provider>
  );
};

export abstract class StickyBaseView extends React.Component<StickyBaseViewProps> {
  protected abstract renderView(): React.ReactNode;
  cachedComponent: React.ReactNode;
  container: StickyViewComponents = null as any;
  static idCounter = 0;
  id = StickyBaseView.idCounter++;
  layout: LayoutRectangle | null = null;
  static contextType = StickyWrapperContext;

  constructor(props: StickyBaseViewProps) {
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
      <StickyComponentsContext.Consumer>
        {(container) => {
          this.container = container;
          return <></>
        }}
      </StickyComponentsContext.Consumer>)
      return this.cachedComponent;
    }
}

export class StickyNav extends StickyBaseView {
  static defaultProps = {
    show: true
  };
  static contextType = StickyWrapperContext;

  constructor(props: StickyNavProps) {
    super(props);
  }

  renderView() {
    return <StickyWrapperContext.Consumer>
      {(context) => {
        const { stickyNavAnimateStyle } = context || {};
        return (
          <Animated.View style={[stickyNavAnimateStyle as any]}
            key={`nav-${this.id}`}
          >
            {this.props.children}
          </Animated.View>
        );
      }}
    </StickyWrapperContext.Consumer>
  }
}

export class StickyContainer extends StickyBaseView {
  static defaultProps = {
    show: true
  };
  static contextType = StickyWrapperContext;

  constructor(props: StickyContainerProps) {
    super(props);
  }
  
  renderView() {
    return <StickyWrapperContext.Consumer>
      {(context) => {
        const { stickyContainerAnimateStyle } = context || {};
        return (
          <Animated.View style={[ stickyContainerAnimateStyle as any, this.props.style]}
            key={`header-${this.id}`}
          >
            {this.props.children}
          </Animated.View>
        );
      }}
    </StickyWrapperContext.Consumer>
  }
}

export class StickyViewComponents extends React.Component<StickyViewComponentsProps, any, any> {
  children: Map<StickyBaseView, React.ReactNode> = new Map();
  id = 0;

  add(c: StickyBaseView, n: React.ReactNode) {
    this.children.set(c, n);
    setTimeout(() => this.setState({ id: ++this.id }));
  }

  remove(c: StickyBaseView) {
    this.children.delete(c);
    setTimeout(() => this.setState({ id: ++this.id }));
  }

  render() {
    return (
      <StickyComponentsContext.Provider value={this}>
        <StickyWrapper hasAppnavbar={this.props.hasAppnavbar} onscroll={this.props.onscroll} notifier={this.props.notifier}>
          {(this.props as any).children}
          <Animated.View style={{ position: 'absolute', width: '100%', zIndex: 10 }} pointerEvents={'box-none'}>
            {Array.from(this.children.entries()).map(([view, node]) => {
              const element = node as React.ReactElement;
              return React.cloneElement(element, { 
                key: `sticky-${view.id}`,
                style: element.props.style
              });
            })}
          </Animated.View>
        </StickyWrapper>
      </StickyComponentsContext.Provider>
    );
  }
}