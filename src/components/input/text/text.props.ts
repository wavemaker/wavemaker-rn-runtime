import BaseInputProps from "@wavemaker/app-rn-runtime/components/input/baseinput/baseinput.props";

export default class WmTextProps extends BaseInputProps {
  floatinglabel?: string;
  placeholder: string = 'Enter text';
  skeletonheight?: string = null as any;
  skeletonwidth?: string = null as any;
  autocapitalize?: string = 'none';
  returnkeytype: 'auto' | 'next' | 'done' = 'auto';
  onSubmitEditing:  Function = () => {};
}
