import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmAccordionProps extends BaseProps {
  animation: string = 'fadeInDown';
  children: any;
  defaultpaneindex: number = 0;
}
