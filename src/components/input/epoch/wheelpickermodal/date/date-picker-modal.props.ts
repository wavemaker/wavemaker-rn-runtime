import { BaseProps } from "@wavemaker/app-rn-runtime/core/base.component";

export default class WmDatePickerModalProps extends BaseProps {
  isVisible: boolean = false;
  selectedDate?: any;
  onClose?: () => void;
  onSelect?: (date: Date) => void;
  onCancel?: () => void;
  dateheadertitle?: string = "Select Date";
  dateconfirmationtitle?: string = "Select";
  datecanceltitle?: string = "Cancel";
}
