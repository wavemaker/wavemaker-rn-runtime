const fs = require('fs-extra');
const handlebars = require('handlebars');

const WAVICON_STYLESHEET = '../../wavemaker-studio-frontend/wavemaker-app-runtime-angularjs/components/wavicon/css/wavicon.css';
const WAVICON_TTF = '../../wavemaker-studio-frontend/wavemaker-app-runtime-angularjs/components/wavicon/fonts/wavicon.ttf';
const WM_SL_L_STYLESHEET = '../../wavemaker-studio-frontend/wavemaker-app-runtime-angularjs/components/wm-streamline-icon/light/css/wm-streamline-light-icon.css';
const WM_SL_L_TTF = '../../wavemaker-studio-frontend/wavemaker-app-runtime-angularjs/components/wm-streamline-icon/light/fonts/wm-streamline-light-icon.ttf';
const WM_SL_R_STYLESHEET = '../../wavemaker-studio-frontend/wavemaker-app-runtime-angularjs/components/wm-streamline-icon/regular/css/wm-streamline-regular-icon.css';
const WM_SL_R_TTF = '../../wavemaker-studio-frontend/wavemaker-app-runtime-angularjs/components/wm-streamline-icon/regular/fonts/wm-streamline-regular-icon.ttf';
const TEMPLATE = handlebars.compile(`
/*******************************************************
 * Don't make any changes.
 * This is a generated file.
 * See wavicon.generator.js
 ********************************************************/

import font from './{{iconSetName}}.ttf';
import createIconSet from '@expo/vector-icons/build/createIconSet';

export const glyphMap: any = {{{iconset}}};

export default createIconSet(glyphMap, '{{iconSetName}}', font);
`);


function generate(iconSetName, styleSheet, iconSetPrefix, fontFile) {
    const text = fs.readFileSync(styleSheet, 'utf-8');
    const fontFolder = `src/components/basic/icon/${iconSetName}`;
    const obj = JSON.parse('{' +  text.substring(text.indexOf(iconSetPrefix))
            .replace(new RegExp(iconSetPrefix, 'g'), ',"')
            .replace(/:before(\s)*\{\s*content/g,'"')
            .replace(/;\s*}\s*/g, '')
            .replace(',', '')
            .replace(/\\f/g,'\\uF') + '}');
    fs.mkdirpSync(fontFolder);
    fs.writeFileSync(`${fontFolder}/${iconSetName}.component.tsx`, TEMPLATE({
        iconset: JSON.stringify(obj, null, 4),
        iconSetName: iconSetName
    }));
    fs.copyFileSync(fontFile, `${fontFolder}/${iconSetName}.ttf`,);
    console.log(`generated ${iconSetName}`);
}

generate('wavicon', WAVICON_STYLESHEET, '.wi-', WAVICON_TTF);
generate('streamline-light-icon', WM_SL_L_STYLESHEET, '.wm-sl-l.sl-', WM_SL_L_TTF);
generate('streamline-regular-icon', WM_SL_R_STYLESHEET, '.wm-sl-r.sl-', WM_SL_R_TTF);