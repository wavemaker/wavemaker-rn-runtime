import BaseNumberProps from '@wavemaker/app-rn-runtime/components/input/basenumber/basenumber.props';

export default class WmCurrencyProps extends BaseNumberProps {
  currency: any;
  placeholder: string = '';
  floatinglabel?: string;
  skeletonheight?: string = null as any;
  skeletonwidth?: string = null as any;
}
