
import React from "react";
import { ViewStyle, Animated } from "react-native";
import { Theme, ThemeProvider } from "../styles/theme";
import { BaseComponent, BaseComponentState } from "./base.component";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";

const StickyViewContext = React.createContext<StickyViewContainer>(null as any);

export interface StickyViewProps {
    style?: ViewStyle,
    show?: "ON_SCROLL_UP" | "ON_SCROLL_DOWN" | "ALWAYS" | "HIDE" ;
    theme: Theme;
    usememo?: boolean;
    children?: any;
    component: BaseComponent<any, any, any>;
}

export class StickyView extends BaseComponent<StickyViewProps, any, any> {
    static defaultProps = {
        show: "ALWAYS"
    };
    static counter = Date.now();
    container?: StickyViewContainer = null as any;
    cachedComponent: React.ReactNode;
    id = StickyView.counter++;
    destroyScrollListner: Function = null as any;
    insets: any = null;

    headerHeight: number = 0;
    headerY: any = new Animated.Value(0);
    headerTranslateY: any = new Animated.Value(0);

    stickyY: number = 0;
    stickyTranslateY: Animated.Value = new Animated.Value(0);

    prevPosition: number = 0;
    accumulatedScrollDelta: number = 0;

    constructor(props: StickyViewProps) {
        super(props, '');
        this.handleScroll();
    }

    private getLayouts(): void {
        const component = this.props.component;
        switch(this.props.show){
            case 'ON_SCROLL_DOWN' :
                this.headerHeight = component.getLayout().height;
                this.headerTranslateY = this.headerY.interpolate({
                    inputRange: [0, this.headerHeight],
                    outputRange: [0, -this.headerHeight],
                    extrapolate: 'clamp',
                });
            case 'ALWAYS' :
                this.stickyY = component.getLayout().py;
                if(this.stickyY) this.stickyTranslateY.setValue(this.stickyY);
            default :
                break;
        }
        this.forceUpdate();
    }

    componentDidMount() {
        super.componentDidMount();
        setTimeout(()=>{
            this.getLayouts();
        },1000)
    }

    componentWillUnmount() {
        this.destroyScrollListner && this.destroyScrollListner();
    }

    handleScroll = () => {
        this.destroyScrollListner && this.destroyScrollListner();
        const component = this.props.component;

        this.destroyScrollListner = component.subscribe('scroll', (event: any) => {
            const position = event.nativeEvent.contentOffset.y;
            const delta = position - this.prevPosition;

            const SCROLL_THRESHOLD = 0.5; 
            if (Math.abs(delta) < SCROLL_THRESHOLD) {
                return ; 
            }

            const stickyYval = this.stickyY - this.headerHeight - this.accumulatedScrollDelta  >= position
                ? this.stickyY - position
                : this.headerHeight + this.accumulatedScrollDelta ;

            if (delta > 0) {
                this.accumulatedScrollDelta = Math.min( this.accumulatedScrollDelta + delta, this.headerHeight);
                this.headerY.setValue(this.accumulatedScrollDelta);
                this.stickyTranslateY.setValue(stickyYval);
            } else {
                this.accumulatedScrollDelta = Math.max( this.accumulatedScrollDelta + delta, 0 );
                this.headerY.setValue(this.accumulatedScrollDelta);
                this.stickyTranslateY.setValue(stickyYval);
            }
            this.prevPosition = position;       
        })
    };
    
    renderWidget() {
        this.cachedComponent = (this.props.usememo === true && this.cachedComponent ) || (
        <SafeAreaInsetsContext.Consumer>
            {(insets = { top: 0, bottom: 0, left: 0, right: 0 }) => {
            this.insets = insets;
            return <StickyViewContext.Consumer>
                {(container) => {
                    this.container = container;
                    const translateYval = this.props.show === 'ON_SCROLL_DOWN' ? this.headerTranslateY : this.stickyTranslateY ;
                    if (this.container) {
                        this.container.add(this, (
                            <ThemeProvider value={this.props.theme} key={this.id}>
                                <Animated.View style={[this.props.style, {
                                    width: '100%', position: 'absolute', 
                                    zIndex: 100,
                                    transform: [{translateY: translateYval}]
                                }]}>
                                    {this.props.children}
                                </Animated.View>
                            </ThemeProvider>
                        ));
                    }
                    return <></>;
                }}
            </StickyViewContext.Consumer>}}
        </SafeAreaInsetsContext.Consumer>
        );
        return this.cachedComponent;
    }
}

export class StickyViewContainer extends React.Component {
    children: Map<StickyView, React.ReactNode> = new Map();
    id = 0;
    insets: any = null;

    add(c: StickyView, n : React.ReactNode) {
        this.children.set(c, n);
        setTimeout(() => this.setState({id: ++this.id}));
    }

    remove(c: StickyView) {
        this.children.delete(c);
        setTimeout(() => this.setState({id: ++this.id}));
    }

    render() {
        return (
        <SafeAreaInsetsContext.Consumer>
            {(insets = { top: 0, bottom: 0, left: 0, right: 0 }) => {
                this.insets = insets;
                return <StickyViewContext.Provider value={this}>
                    {(this.props as any).children}
                    {Array.from(this.children.values())}
                </StickyViewContext.Provider>
            }}
        </SafeAreaInsetsContext.Consumer>
        );
    }
};
