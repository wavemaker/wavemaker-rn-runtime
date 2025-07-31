import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';
export default class WmPageProps extends BaseProps{
  children: any[] = [];
  hasappnavbar:boolean = true;
  onscroll: string = ''; // none, topnav, topnav-bottomnav
  barstyle:'default'|'dark-content'|'light-content' = 'default';
}