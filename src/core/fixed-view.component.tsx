
import React from "react";
import { View, ViewStyle } from "react-native";
import { Theme, ThemeProvider } from "../styles/theme";

const FixedViewContext = React.createContext<FixedViewContainer>(null as any);

export interface FixedViewProps {
    style?: ViewStyle,
    show?: boolean;
    theme: Theme;
    usememo?: boolean;
    children?: any;
}

export class FixedView extends React.Component<FixedViewProps> {
    static defaultProps = {
        show: true
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
        this.cachedComponent = (this.props.usememo === true && this.cachedComponent ) || (<FixedViewContext.Consumer>
            {(container) => {
                this.container = container;
                if (this.props.show) {
                    container.add(this, (
                        <ThemeProvider value={this.props.theme} key={this.id}>
                            <View style={[
                                {position: 'absolute'},
                                this.props.style]}>
                                {this.props.children}
                            </View>
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