
import React from "react";
import { View, ViewStyle, Animated } from "react-native";
import { Theme, ThemeProvider } from "../styles/theme";

const FixedViewContext = React.createContext<FixedViewContainer>(null as any);

export interface FixedViewProps {
    name?: string;
    style?: ViewStyle,
    show?: boolean;
    theme: Theme;
    usememo?: boolean;
    children?: any;
    animated?: boolean;
}

export class FixedView extends React.Component<FixedViewProps> {
    static defaultProps = {
        show: true, 
        animated: false
    };
    static counter = Date.now();
    container: FixedViewContainer = null as any;
    cachedComponent: React.ReactNode;
    id = FixedView.counter++;

    constructor(props: FixedViewProps) {
        super(props);
    }

    componentWillUnmount() {
        this.container.remove(this);
    }

    render() {
        const WrapperView = this.props.animated ? Animated.View : View
        this.cachedComponent = (this.props.usememo === true && this.cachedComponent ) || (<FixedViewContext.Consumer>
            {(container) => {
                this.container = container;
                if (this.props.show) {
                    container.add(this, (
                        <ThemeProvider value={this.props.theme} key={this.id}>
                            <WrapperView style={[
                                {position: 'absolute'},
                                this.props.style]}
                                testID={`${this.props.name}-fixed-view`}
                            >
                                {this.props.children}
                            </WrapperView>
                        </ThemeProvider>
                    ));
                } else {
                    container.remove(this);
                }
                return <></>;
            }}
        </FixedViewContext.Consumer>);
        return this.cachedComponent;
    }
}

export class FixedViewContainer extends React.Component {
    children: Map<FixedView, React.ReactNode> = new Map();
    id = 0;

    add(c: FixedView, n : React.ReactNode) {
        this.children.set(c, n);
        setTimeout(() => this.setState({id: ++this.id}));
    }

    remove(c: FixedView) {
        this.children.delete(c);
        setTimeout(() => this.setState({id: ++this.id}));
    }

    render() {
        return (
            <FixedViewContext.Provider value={this}>
                {(this.props as any).children}
                {Array.from(this.children.values())}
            </FixedViewContext.Provider>
        ) ;
    }
};