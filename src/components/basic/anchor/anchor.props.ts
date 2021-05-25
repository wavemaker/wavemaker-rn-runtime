import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmAnchorProps extends BaseProps {
    caption = 'Link';
    hyperlink: string = null as any;
    encodeurl = false;
    badgevalue: string = null as any;
    width: string = null as any;
    height: string = null as any;
    iconclass: string = null as any;
    iconposition: string = 'left';
}