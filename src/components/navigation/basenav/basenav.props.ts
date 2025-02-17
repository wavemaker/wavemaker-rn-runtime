import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export class BaseNavProps extends BaseProps {
  dataset?: any = null as any;
  itemlabel?: string | ((item: any) => string) = 'label' as any;
  itemlink?: string | ((item: any) => string) = 'link' as any;
  itemicon?: string | ((item: any) => string) = 'icon' as any;
  itembadge?: string | ((item: any) => string) = null as any;
  isactive?: string | ((item: any) => string) = null as any;
  itemchildren?: string = null as any;
  getDisplayExpression? = (label: string) => null as any;
}
