import { PartialHostProps } from './partial-host.component';

export default class WmContainerProps extends PartialHostProps {
  animation?: string = null as any;
  animationdelay?: number = null as any;
  onLoad?: Function;
  scrollable?: Boolean = false as any;
  issticky?: Boolean = false as boolean;
}
