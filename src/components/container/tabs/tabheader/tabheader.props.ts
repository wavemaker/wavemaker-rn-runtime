import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmTabheaderProps extends BaseProps {
  data: {icon: string, key: string, title: string}[] = [] as any;
  selectedTabIndex? = 0;
  onIndexChange?: (index: number) => any = null as any;
  shouldScroll?: boolean;
}