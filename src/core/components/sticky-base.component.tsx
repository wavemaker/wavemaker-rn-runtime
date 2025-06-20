import React, { ReactNode } from "react";
import { LayoutRectangle, ViewStyle } from "react-native";
import { BaseComponent, BaseComponentState, BaseProps, BaseStyles } from "../base.component";
import { StickyComponentsContext, StickyViewComponents } from "../sticky-view.component";
import { StickyWrapperContext } from "../sticky-wrapper";

export interface StickyBaseViewProps {
  style?: ViewStyle[];
  show?: boolean;
  theme?: any;
  usememo?: boolean;
  children?: any;
  renderView?: () => ReactNode;
  component?: BaseComponent<BaseProps, BaseComponentState<any>, BaseStyles>;
}

export abstract class StickyBaseView extends React.Component<StickyBaseViewProps> {
  protected abstract renderView(): React.ReactNode;
  cachedComponent: React.ReactNode;
  container: StickyViewComponents = null as any;
  static idCounter = 0;
  id = StickyBaseView.idCounter++;
  layout: LayoutRectangle | null = null;
  static contextType = StickyWrapperContext;

  constructor(props: StickyBaseViewProps) {
    super(props);
  }

  componentWillUnmount() {
    this.container?.remove(this);
  }

  componentDidMount() {
    if (this.props.show) {
      this.container.add(this, this.renderView());
    }
  }

  render() {
    this.cachedComponent = (this.props.usememo === true && this.cachedComponent ) || (
      <StickyComponentsContext.Consumer>
        {(container) => {
          this.container = container;
          return <></>
        }}
      </StickyComponentsContext.Consumer>)
      return this.cachedComponent;
    }
}