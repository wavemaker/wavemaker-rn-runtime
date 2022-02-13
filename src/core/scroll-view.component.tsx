import React from 'react';
import { ScrollView as RNScrollView, ScrollViewProps as RNScrollViewProps, View } from 'react-native';

export interface ScrollViewProps extends RNScrollViewProps {

}

export interface ScrollViewState {
    scrollEnabled: boolean;
}

const ScrollViewContext = React.createContext<ScrollView>(null as any);

export const ScrollViewProvider = ScrollViewContext.Provider;
export const ScrollViewConsumer = ScrollViewContext.Consumer;
// TODO: implement scroll view that handles FlatList.
export class ScrollView extends React.Component<ScrollViewProps, ScrollViewState> {

    public instance: ScrollView = null as any;

    constructor(props: ScrollViewProps) {
        super(props);
        this.state = {
            scrollEnabled: true
        } as ScrollViewState;
    }

    enableScroll() {
        this.setState({
            scrollEnabled: true
        });
    }

    disableScroll() {
        this.setState({
            scrollEnabled: false
        });
    }

    isScrollEnabled() {
        return this.state.scrollEnabled;
    }

    get contentOffset(): number {
        return this.instance.contentOffset;
    }

    render() {
        return (
            <ScrollViewProvider value={this}>
                <View onStartShouldSetResponderCapture={() => {
                    this.setState({
                        scrollEnabled: true
                    });
                    return true;
                }}>
                    <RNScrollView
                        ref={scrollRef => (this.instance = scrollRef as any)}
                        {...this.props} scrollEnabled={this.state.scrollEnabled}>
                        {this.props.children}
                    </RNScrollView>
                </View>
            </ScrollViewProvider>
        ); 
    }
}
