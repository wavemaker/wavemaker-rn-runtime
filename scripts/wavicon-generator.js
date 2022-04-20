const fs = require('fs-extra');
const handlebars = require('handlebars');

const WAVICON_STYLESHEET = '../../wavemaker-studio-frontend/wavemaker-app-runtime-angularjs/components/wavicon/css/wavicon.css';
const WM_SL_L_STYLESHEET = '../../wavemaker-studio-frontend/wavemaker-app-runtime-angularjs/components/wm-streamline-icon/light/css/wm-streamline-light-icon.css';
const WM_SL_R_STYLESHEET = '../../wavemaker-studio-frontend/wavemaker-app-runtime-angularjs/components/wm-streamline-icon/regular/css/wm-streamline-regular-icon.css';
const TEMPLATE = handlebars.compile(`
/*******************************************************
 * Don't make any changes.
 * This is a generated file.
 * See wavicon.generator.js
 ********************************************************/

 import injector from '@wavemaker/app-rn-runtime/core/injector';
 import AppConfig from '@wavemaker/app-rn-runtime/core/AppConfig';
 import { Icon } from '@expo/vector-icons/build/createIconSet';


export const glyphMap: any = {{{iconset}}};

let fontSet: Icon<any, any> = null as any;

export default () => {
    if (!fontSet) {
        const appConfig = injector.get<AppConfig>('APP_CONFIG');
        fontSet = appConfig.assets['{{iconSetName}}'];
    }
    return fontSet;
};
`);

function generate(iconSetName, styleSheet, iconSetPrefix) {
    const text = fs.readFileSync(styleSheet, 'utf-8');
    const obj = JSON.parse('{' +  text.substring(text.indexOf(iconSetPrefix))
            .replace(new RegExp(iconSetPrefix, 'g'), ',"')
            .replace(/:before(\s)*\{\s*content/g,'"')
            .replace(/;\s*}\s*/g, '')
            .replace(',', '')
            .replace(/\\f/g,'\\uF') + '}');
    fs.writeFileSync(`src/components/basic/icon/${iconSetName}.component.tsx`, TEMPLATE({
        iconset: JSON.stringify(obj, null, 4),
        iconSetName: iconSetName
    }));
    console.log(`generated ${iconSetName}`);
}

generate('wavicon', WAVICON_STYLESHEET, '.wi-');
generate('streamline-light-icon', WM_SL_L_STYLESHEET, '.wm-sl-l.sl-');
generate('streamline-regular-icon', WM_SL_R_STYLESHEET, '.wm-sl-r.sl-');