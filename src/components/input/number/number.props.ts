import BaseNumberProps from '@wavemaker/app-rn-runtime/components/input/basenumber/basenumber.props';

export default class WmNumberProps extends BaseNumberProps {
  autofocus: boolean = null as any;
  floatinglabel?: string;
  placeholder: string = '';
  skeletonheight?: string = null as any;
  skeletonwidth?: string = null as any;
}
