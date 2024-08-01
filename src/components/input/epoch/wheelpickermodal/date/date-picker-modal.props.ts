import { BaseProps } from "@wavemaker/app-rn-runtime/core/base.component";

export default class WmDatePickerModalProps extends BaseProps {
  isVisible: boolean = false;
  minDate?: Date | string;
  maxDate?: Date | string;
  selectedDate?: any;
  onClose?: () => void;
  onSelect?: (date: Date) => void;
  onCancel?: () => void;
}
