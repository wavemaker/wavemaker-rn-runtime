
import React from "react";
import { ViewStyle, Animated, Easing} from "react-native";
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


export class StickyViewState extends BaseComponentState<StickyViewProps>{
    isStickyVisible = false;
}

export class StickyView extends BaseComponent<StickyViewProps, StickyViewState, any> {
    static defaultProps = {
        show: "ALWAYS"
    };
    static counter = Date.now();
    container?: StickyViewContainer = null as any;
    cachedComponent: React.ReactNode;
    id = StickyView.counter++;
    destroyScrollListner: Function = null as any;
    hideViewOpacity: Animated.Value = new Animated.Value(0);
    hiddenViewHeight: number = 0;
    movedUp: boolean = false;
    insets: any = null;

    constructor(props: StickyViewProps) {
        super(props, '');
        this.state = new StickyViewState();
        this.listenScrollEvent();
    }

    componentWillUnmount() {
        this.container?.remove(this);
        this.destroyScrollListner && this.destroyScrollListner();
    }

    componentWillAttach() {
        super.componentWillAttach();
        this.setState({hide: false});
    }

    componentWillDetach() {
        super.componentWillDetach();
        this.setState({hide: true});
    }

    showStickyView(){
       if(this.movedUp){
        const ht = (this.container?.containerHeight || 0 ) + this.hiddenViewHeight
        this.movedUp = false;
        this.container?.updateContainerHeight(ht)
        this.container?.moveUp(0);
        this.hideViewOpacity.setValue(1);

        // Animated.parallel([
        // Animated.timing(this.hideViewOpacity, {
        //     toValue: 1, 
        //     duration: 200,
        //     useNativeDriver: true
        // }).start();
        //     Animated.timing(this.container.translateY, {
        //         toValue: 0, 
        //         duration: 200,
        //         useNativeDriver: true
        //     })
        // ]).start();
       }
    }

    hideStickyView(e: any, height: number){
    // const withAnimataion = e.nativeEvent.contentOffset.y >= 20
        this.hiddenViewHeight = height;
        if(!this.movedUp){
            const ht = (this.container?.containerHeight || 0) - height
            this.movedUp = true;
            this.container?.updateContainerHeight(ht);
            this.container?.moveUp(-1 * height);
            this.hideViewOpacity.setValue(0);

            // Animated.parallel([
            //     Animated.timing(this.container.opacity, {
            //         toValue: 0, 
            //         duration: 200,
            //         useNativeDriver: true
            //     }),
            //     Animated.timing(this.container.translateY, {
            //         toValue: -height, 
            //         duration: 200,
            //         useNativeDriver: true
            //     })
            // ]).start();
        }
    }

    listenScrollEvent(): void {
        this.destroyScrollListner && this.destroyScrollListner();
        const component = this.props.component;
        
        this.destroyScrollListner = component.subscribe('scroll', (e: any, pageScroll: any) => {

        const height = component.getLayout()?.height;
        const yPosition = component.getLayout()?.py;
        const scrollPosition = e.nativeEvent.contentOffset.y;
        let isStickyVisible = false ;

        const containerHeightWithInsets = Math.abs(this.container?.containerHeight || 0) + this.container?.insets?.top
        if(e.scrollDirection <= 0){
            if(this.props.show == 'ON_SCROLL_UP'){
                this.hideStickyView(e, height);
            }else if(this.props.show == 'ON_SCROLL_DOWN'){
                this.showStickyView();
            }
            isStickyVisible = (scrollPosition + containerHeightWithInsets) >= (yPosition + height);
            this.container?.safeAreaInsetViewOpacity.setValue(1);
            if(scrollPosition <=10){
                pageScroll.scrollRef?.current?.scrollTo({ x: 0, y: 0, animated: false });
                this.container?.updateContainerHeight(0);
                this.hideViewOpacity.setValue(0);
                this.container?.remove(this);
                isStickyVisible = false;
            }
        } else {
            if(this.props.show == 'ON_SCROLL_UP'){
                this.showStickyView();
            }else if(this.props.show == 'ON_SCROLL_DOWN'){
                this.hideStickyView(e, height);
            }
            isStickyVisible =  scrollPosition >= (yPosition - containerHeightWithInsets);
            const val =  Math.abs(this.container?.containerHeight || 0) > 0 ? 1 : 0
            this.container?.safeAreaInsetViewOpacity.setValue(val);
        }
        
        if (this.state.isStickyVisible !== isStickyVisible) {
            this.setState({  isStickyVisible : isStickyVisible })
        }
        })
    }

    renderWidget() {
        // let opacity = this.container?.translateY?.interpolate({
        //     inputRange: [-80, 0],
        //     outputRange: [0.7, 1], 
        //     extrapolate: 'clamp'
        //   });

        this.cachedComponent = (this.props.usememo === true && this.cachedComponent ) || (
        <SafeAreaInsetsContext.Consumer>
            {(insets = { top: 0, bottom: 0, left: 0, right: 0 }) => {
            this.insets = insets;
            return <StickyViewContext.Consumer>
                {(container) => {
                    this.container = container;
                    if (this.props.show != "HIDE" && this.state.isStickyVisible && this.container) {
                        this.container.add(this, (
                            <ThemeProvider value={this.props.theme} key={this.id}>
                                <Animated.View style={[this.props.style, 
                                    {
                                        opacity: this.props.show == 'ON_SCROLL_DOWN' ? this.hideViewOpacity : 1
                                    }
                                ]} 
                                >
                                    {this.props.children}
                                </Animated.View>
                            </ThemeProvider>
                        ));
                    } else {
                        this.container?.remove(this);
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
    translateY: Animated.Value = new Animated.Value(0);
    opacity: Animated.Value = new Animated.Value(1);
    containerHeight: number = 0;
    insets: any = null;
    safeAreaInsetViewOpacity: Animated.Value = new Animated.Value(0);

    updateContainerHeight(val: number){
        this.containerHeight = val;
    }

    add(c: StickyView, n : React.ReactNode) {
        this.containerHeight += c.props.component.getLayout()?.height || 0 ;
        this.children.set(c, n);
        setTimeout(() => this.setState({id: ++this.id}));
    }

    public changeOpacity(value: number){
        this.opacity.setValue(value);
    }

    public moveUp(value: number){
        // if(withAnimataion){
            Animated.timing(this.translateY, {
                toValue: value as number,
                easing: Easing.linear, 
                duration: 80,
                useNativeDriver: true
            }).start();
        // }else {
            // this.translateY.setValue(value);
        // }
    }

    remove(c: StickyView) {
        if(this.children.size && this.containerHeight >=0) {
            this.containerHeight -= c.props.component.getLayout()?.height || 0 ;
        }
        this.children.delete(c);
        setTimeout(() => this.setState({id: ++this.id}));
    }

    render() {
        // let translateY = this.translateY?.interpolate({
        //     inputRange: [-80, 0],
        //     outputRange: [-80, 0], 
        //     extrapolate: 'clamp'
        //   });

        // let opacity = this.translateY?.interpolate({
            // inputRange: [-20, 0],
            // outputRange: [0, 1], 
            // extrapolate: 'clamp'
        // });

        return (
        <SafeAreaInsetsContext.Consumer>
            {(insets = { top: 0, bottom: 0, left: 0, right: 0 }) => {
                this.insets = insets;
                return <>
                <StickyViewContext.Provider value={this}>
                    {(this.props as any).children}
                    <Animated.View style={{
                        height: insets?.top || 0,
                        width: '100%',
                        backgroundColor: 'black', 
                        position:"absolute",
                        top:0,
                        opacity: this.safeAreaInsetViewOpacity
                    }}></Animated.View>
                    <Animated.View style={{
                        position: 'absolute', top: insets?.top || 0, width: '100%',
                        transform: [{
                            translateY: this.translateY
                        }],
                        // opacity: this.opacity
                    }}
                    >
                    {Array.from(this.children.values())}
                    </Animated.View>
                </StickyViewContext.Provider>
            </>}}
        </SafeAreaInsetsContext.Consumer>
        );
    }
};