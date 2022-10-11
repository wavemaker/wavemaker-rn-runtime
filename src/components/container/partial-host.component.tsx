import { BaseComponent, BaseComponentState, BaseProps, BaseStyles } from "@wavemaker/app-rn-runtime/core/base.component";

export abstract class PartialHostState<T extends BaseProps> extends BaseComponentState<T> {
    isPartialLoaded = false;
}

export abstract class PartialHostProps extends BaseProps {
  renderPartial?: Function;
  children?: any;
}

export abstract class PartialHost<T extends BaseProps, S extends  PartialHostState<T>, L extends BaseStyles>
    extends BaseComponent<T, S, L> {

    constructor(markupProps: T, defaultClass: string, defaultStyles?: L, defaultProps?: T, defaultState?: S) {
        super(markupProps, defaultClass, defaultStyles, defaultProps, defaultState);
    }

    onPartialLoad() {
        this.invokeEventCallback('onLoad', [this]);
    }

    renderContent(props: PartialHostProps) {
        if (props.renderPartial) {
            if (!this.state.isPartialLoaded && !this.isVisible()) {
                return null;
            }
            if (!this.state.isPartialLoaded) {
                setTimeout(() => {
                    this.updateState({
                        isPartialLoaded: true
                    } as any);
                });
            }
            return props.renderPartial(this.onPartialLoad.bind(this));
        }
        return props.children;
    }

}