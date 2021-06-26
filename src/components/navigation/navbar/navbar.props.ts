import { BaseNavProps } from '@wavemaker/app-rn-runtime/components/navigation/basenav/basenav.props';

export default class WmNavbarProps extends BaseNavProps {
  type: string = 'pills';
  layout: string = '';
  children?: any = [] as any;
  indent = 0;
  onSelect? = () => {};
  ischildnav? = false;
}
