import { BaseProps } from "@wavemaker/app-rn-runtime/core/base.component";

export default class WmTimePickerModalProps extends BaseProps {
  isVisible: boolean = false;
  selectedDateTime?: any;
  is24Hour?: boolean = true;
  onClose?: () => void;
  onSelect?: (time: Date) => void;
  onCancel?: () => void;
  timeheadertitle?: string = "Select Time";
  timeconfirmationtitle?: string = "Select";
  timecanceltitle?: string = "Cancel";
}
