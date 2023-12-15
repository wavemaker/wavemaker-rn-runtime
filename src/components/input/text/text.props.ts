import BaseInputProps from "@wavemaker/app-rn-runtime/components/input/baseinput/baseinput.props";

export default class WmTextProps extends BaseInputProps {
  label?: string;
  isFloating?: boolean = true;
  placeholder: string = 'Enter text';
}
