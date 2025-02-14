
import React from "react";
import { View, ViewStyle, Animated, LayoutChangeEvent } from "react-native";
import { Theme, ThemeProvider } from "../styles/theme";
import { BaseComponent } from "./base.component";

const StickyViewContext = React.createContext<StickyViewContainer>(null as any);

export interface StickyViewProps {
    style?: ViewStyle,
    show?: "ON_SCROLL_UP" | "ON_SCROLL_DOWN" | "ALWAYS" | "HIDE" ;
    theme: Theme;
    usememo?: boolean;
    children?: any;
    component: BaseComponent<any, any, any>;
}


export class StickyViewState {
    isStickyVisible = false;
}

export class StickyView extends React.Component<StickyViewProps, StickyViewState> {
    static defaultProps = {
        show: "ALWAYS"
    };
    static counter = Date.now();
    container?: StickyViewContainer = null as any;
    cachedComponent: React.ReactNode;
    id = StickyView.counter++;
    destroyScrollListner: Function = null as any;
    layout: any = {};

    constructor(props: StickyViewProps) {
        super(props);
        this.state = new StickyViewState();
        this.listenScrollEvent();
    }

    componentWillUnmount() {
        this.container?.remove(this);
        this.destroyScrollListner && this.destroyScrollListner();
    }

    showView(){
        this.container?.moveUp(0);
    }

    hideView(){
        const position = this.layout.height || 0;
        this.container?.moveUp(-1 * position);
    }

    listenScrollEvent(): void {
        this.destroyScrollListner && this.destroyScrollListner();
        const component = this.props.component;
        this.destroyScrollListner = component.subscribe('scroll', (e: any) => {
        if(e.scrollDirtection <= 0){
            if(this.props.show == 'ON_SCROLL_UP'){
                this.hideView();
            }else if(this.props.show == 'ON_SCROLL_DOWN'){
                this.showView();
            }
        } else {
            if(this.props.show == 'ON_SCROLL_UP'){
                this.showView();
            }else if(this.props.show == 'ON_SCROLL_DOWN'){
                this.hideView();
            }
        }
          const scrollPosition = e.nativeEvent.contentOffset.y;
          const yPosition = component.getLayoutOfWidget();
          const isStickyVisible = scrollPosition > yPosition;
          if (this.state.isStickyVisible !== isStickyVisible) {
            this.setState({ 
              isStickyVisible : isStickyVisible
            })
          }
        })
      }

    handleLayout = (event: LayoutChangeEvent) => {
        this.layout = event.nativeEvent.layout;
    }

    render() {
        this.cachedComponent = (this.props.usememo === true && this.cachedComponent ) || (<StickyViewContext.Consumer>
            {(container) => {
                this.container = container;
                if (this.props.show != "HIDE" && this.state.isStickyVisible && this.container) {
                    this.container.add(this, (
                        <ThemeProvider value={this.props.theme} key={this.id}>
                            <View style={this.props.style}
                                onLayout={this.handleLayout}
                            >
                                {this.props.children}
                            </View>
                        </ThemeProvider>
                    ));
                } else {
                    this.container?.remove(this);
                }
                return <></>;
            }}
        </StickyViewContext.Consumer>);
        return this.cachedComponent;
    }
}

export class StickyViewContainer extends React.Component {
    children: Map<StickyView, React.ReactNode> = new Map();
    id = 0;
    translateY = new Animated.Value(0);

    add(c: StickyView, n : React.ReactNode) {
        this.children.set(c, n);
        setTimeout(() => this.setState({id: ++this.id}));
    }

    public moveUp(value: number){
        Animated.timing(this.translateY, {
            toValue: value as number,
            duration: 280,
            useNativeDriver: true
        }).start();
    }

    remove(c: StickyView) {
        this.children.delete(c);
        setTimeout(() => this.setState({id: ++this.id}));
    }

    render() {
        return (
          <StickyViewContext.Provider value={this}>
            {(this.props as any).children}
            <Animated.View style={{
                position: 'absolute', top: 0, width: '100%',
                transform: [{translateY: this.translateY}]
            }}
            >
              {Array.from(this.children.values())}
            </Animated.View>
          </StickyViewContext.Provider>
        );
    }
};