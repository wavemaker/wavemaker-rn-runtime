import React from "react";
import { Watcher } from "./watcher";

interface MemoProps {
    watcher: Watcher;
    render: (watch: Function) => React.ReactNode
}

interface MemoState {
    id: number;
}

export class WmMemo extends React.Component<MemoProps, MemoState> {

    private watcher: Watcher = null as any;

    constructor(props: MemoProps) {
        super(props);
        this.watcher = props.watcher.create();
        this.state = {
            id: 0
        }
    }

    shouldComponentUpdate(nextProps: any, nextState: any) {
        return Object.keys(nextProps).reduce((p, k) => {
            return p || (k !== 'render' && (this.props as any)[k] !== nextProps[k]);
        }, false) || this.state.id !== nextState.id;
    }

    componentWillUnmount() {
        this.watcher && this.watcher.destroy();
    }

    refresh = () => {
        this.setState({
            id: this.state.id + 1
        });
    }

     watch(fn: Function) {
        return this.watcher.watch(fn, this.refresh).value;
     }

    render() {
        this.watcher.clear();
        return this.props.render(this.watch.bind(this));
    }
}