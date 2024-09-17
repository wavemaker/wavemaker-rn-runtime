import BaseInputProps from '@wavemaker/app-rn-runtime/components/input/baseinput/baseinput.props';

export default class WmTextareaProps extends BaseInputProps {
  floatinglabel?: string;
  placeholder: string = 'Place your text';
  skeletonheight?: string = null as any;
  skeletonwidth?: string = null as any;
}
