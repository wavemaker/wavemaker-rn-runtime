import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';
export default class WmPageProps extends BaseProps{
  children: any[] = [];
  scrollable: boolean = false;
  hasappnavbar:boolean = true;
  barstyle:'default'|'dark-content'|'light-content' = 'default';
}