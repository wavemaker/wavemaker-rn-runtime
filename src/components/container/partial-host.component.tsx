import { BaseComponent, BaseComponentState, BaseProps, BaseStyles } from "@wavemaker/app-rn-runtime/core/base.component";
import { WmSkeletonStyles } from "../basic/skeleton/skeleton.styles";


export type PartialHostStyles = BaseStyles & {
    skeleton: WmSkeletonStyles
}
export abstract class PartialHostState<T extends BaseProps> extends BaseComponentState<T> {
    isPartialLoaded = false;
}

export abstract class PartialHostProps extends BaseProps {
    renderPartial?: Function;
    children?: any;
  }
  
  
export abstract class PartialHost<T extends PartialHostProps, S extends  PartialHostState<T>, L extends PartialHostStyles>
    extends BaseComponent<T, S, L> {

    constructor(markupProps: T, defaultClass: string, defaultProps?: T, defaultState?: S) {
        super(markupProps, defaultClass, defaultProps, defaultState);
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
            return props.renderPartial(props, this.onPartialLoad.bind(this));
        }
        return props.children;
    }

}