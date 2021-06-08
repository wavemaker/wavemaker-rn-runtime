const fs = require('fs-extra');
const handlebars = require('handlebars');

const STYLESHEET = '../../wavemaker-studio-frontend/wavemaker-app-runtime-angularjs/components/wavicon/css/wavicon.css';
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
        fontSet = appConfig.wavIconAsset;
    }
    return fontSet
};
`);

function generate() {
    const text = fs.readFileSync(STYLESHEET, 'utf-8');
    const obj = JSON.parse('{' +  text.substring(text.indexOf('.wi-'))
            .replace(/\.wi-/g, ',"')
            .replace(/:before(\s)*\{\s*content/g,'"')
            .replace(/;\s*}\s*/g, '')
            .replace(',', '')
            .replace(/\\f/g,'\\uF') + '}');
    fs.writeFileSync('src/components/basic/icon/wavicon.component.tsx', TEMPLATE({
        iconset: JSON.stringify(obj, null, 4)
    }));
    console.log('generated wavicons');
}

generate();