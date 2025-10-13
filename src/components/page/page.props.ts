import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';
export default class WmPageProps extends BaseProps{
  children: any[] = [];
  hasappnavbar:boolean = true;
  onscroll: string = ''; // none, topnav, topnav-bottomnav
  statusbarstyle:'default'|'dark-content'|'light-content' = 'default';
  navigationbarstyle:'dark'|'light' = "light";
  showOfflineBanner:boolean = false;
}