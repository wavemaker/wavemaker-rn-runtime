const fs = require('fs-extra');
const handlebars = require('handlebars');

const STYLESHEET = '../../wavemaker-studio-frontend/wavemaker-app-runtime-angularjs/components/wavicon/css/wavicon.css';
const TEMPLATE = handlebars.compile(`
/*******************************************************
 * Don't make any changes.
 * This is a generated file.
 * See wavicon.generator.js
 ********************************************************/

import { createIconSet } from '@expo/vector-icons';


const glyphMap: any = {{{iconset}}};

export default createIconSet(glyphMap, 'wavicon', './fonts/wavicon.ttf');
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