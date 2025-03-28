
import React, { Component } from "react";
import { ViewStyle, Animated, Easing, View} from "react-native";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";

import { Theme, ThemeProvider } from "@wavemaker/app-rn-runtime/styles/theme";

import { BaseComponent } from "./base.component";

const StickyViewContext = React.createContext<StickyViewContainer>(null as any);

export interface StickyViewProps {
    style?: ViewStyle,
    theme: Theme;
    children?: any;
    slide?: boolean,
    component: BaseComponent<any, any, any>;
    onVisibilityChange?: (visible: boolean) => void;
}


export class StickyViewState {
    isStickyVisible = false;
}

export class StickyView extends Component<StickyViewProps, StickyViewState, any> {
    static defaultProps = {
        slide: false
    };
    static counter = Date.now();
    container?: StickyViewContainer = null as any;
    cachedComponent: React.ReactNode;
    id = StickyView.counter++;
    destroyScrollListner: Function = null as any;
    insets: any = null;
    refScrollPosition = 0;
    lastScrollDirection = 1;

    constructor(props: StickyViewProps) {
        super(props);
        this.state = new StickyViewState();
        this.listenScrollEvent();
    }

    componentWillUnmount() {
        this.container?.remove(this);
        this.destroyScrollListner && this.destroyScrollListner();
    }

    listenScrollEvent(): void {
        this.destroyScrollListner && this.destroyScrollListner();
        const component = this.props.component;
        this.destroyScrollListner = component.subscribe('scroll', (e: any) => {
            const height = component.getLayout()?.height;
            const yPosition = component.getLayout()?.py;
            const scrollPosition = e.nativeEvent.contentOffset.y;
            let isStickyVisible = false ;
            
            const containerHeight = Math.abs(this.container?.visibleHeight || 0);
            if (e.scrollDirection) {
                if (this.lastScrollDirection !== e.scrollDirection) {
                    this.refScrollPosition = scrollPosition;
                }
                this.lastScrollDirection = e.scrollDirection;
            }
            if(e.scrollDirection <= 0){
                isStickyVisible = scrollPosition > 10 
                    && ((scrollPosition + containerHeight) >= (yPosition + height));
            } else {
                isStickyVisible =  (scrollPosition >= (yPosition + (this.props.slide ? height: 0)));
            }
            if (this.state.isStickyVisible !== isStickyVisible) {
                this.setState({ 
                    isStickyVisible : isStickyVisible
                }, () => {
                    if (isStickyVisible && this.props.slide) {
                        this.container?.slideBy(-1 * height, 0);
                    } else {
                        this.container?.slideBy(this.refScrollPosition - scrollPosition);
                    }
                })
            } else {
                this.container?.slideBy(this.refScrollPosition - scrollPosition);
            }
        })
    }

    render() {
        return (
            <>
                <SafeAreaInsetsContext.Consumer>
                    {(insets = { top: 0, bottom: 0, left: 0, right: 0 }) => {
                    this.insets = insets;
                    return <StickyViewContext.Consumer>
                        {(container) => {
                            this.container = container;
                            if (this.state.isStickyVisible && this.container) {
                                this.container.add(this, (
                                    <ThemeProvider value={this.props.theme} key={this.id}>
                                        <View style={[this.props.style]}>
                                            {this.props.children}
                                        </View>
                                    </ThemeProvider>
                                ));
                            } else {
                                this.container?.remove(this);
                            }
                            return <></>;
                        }}
                    </StickyViewContext.Consumer>}}
                </SafeAreaInsetsContext.Consumer>
                <View style={{opacity: this.state.isStickyVisible ? 0 : 1}}>
                    {this.props.children}
                </View>
            </>
        );
    }
}

export class StickyViewContainer extends React.Component {
    private children: Map<StickyView, React.ReactNode> = new Map();
    private id = 0;
    private translateY: Animated.Value = new Animated.Value(0);
    private topSlideHeight = 0;
    private hiddenHeight = 0;
    public containerHeight: number = 0;

    add(c: StickyView, n : React.ReactNode) {
        const h = Math.max(c.props.component.getLayout()?.height || 0, 0);
        this.containerHeight += h;
        this.topSlideHeight += (c.props.slide ? h : 0);
        this.children.set(c, n);
        setTimeout(() => this.setState({id: ++this.id}));
    }

    get visibleHeight() {
        return this.containerHeight + this.hiddenHeight;
    }


    remove(c: StickyView) {
        const h = Math.max(c.props.component.getLayout()?.height || 0, 0);
        this.containerHeight -=  h;
        this.topSlideHeight -= (c.props.slide ? h : 0);
        this.containerHeight = Math.max(this.containerHeight, 0);
        this.topSlideHeight = Math.max(this.topSlideHeight, 0);
        this.children.delete(c);
        setTimeout(() => this.setState({id: ++this.id}));
    }

    public slideBy(value: number, duration = 1) {
        this.hiddenHeight = Math.max(
            Math.min(0, (this.translateY as any)._value + value), 
            -1 * this.topSlideHeight);
        Animated.timing(this.translateY, {
            toValue: this.hiddenHeight,
            easing: Easing.linear, 
            duration: duration,
            useNativeDriver: true
        }).start();
    }

    render() {
        return (
            <StickyViewContext.Provider value={this}>
                {(this.props as any).children}
                <Animated.View style={{
                    position: 'absolute', top: 0, width: '100%',
                    transform: [{
                        translateY: this.translateY
                    }]
                }}
                >
                {Array.from(this.children.values())}
                </Animated.View>
            </StickyViewContext.Provider>
        );
    }
};