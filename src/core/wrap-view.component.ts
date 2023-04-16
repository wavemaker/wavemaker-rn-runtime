import { Component } from 'react';

interface WrapViewProps {
    children: any;
    onLoad?: () => any;
}

export class WrapView extends Component<WrapViewProps> {

    constructor(props: WrapViewProps) {
        super(props);
    }

    componentDidMount(): void {
        if (this.props.onLoad) {
            setTimeout(this.props.onLoad);
        }
    }

    render() {
        return (this.props.children);
    }
}