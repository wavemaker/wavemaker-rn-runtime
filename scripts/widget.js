const fs = require('fs-extra');
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const handlebars = require('handlebars');
const { capitalize, camelCase } = require('lodash');
const projectDir = '.';

const loadTemplate = (templatePath) => {
    const template = fs.readFileSync(__dirname + '/' + templatePath, 'utf8');
    return handlebars.compile(template);
};

const WIDGET_COMPONENT_TEMPLATE = loadTemplate('./widget-template/widget.component.tsx.hbs');
const WIDGET_PROPS_TEMPLATE = loadTemplate('./widget-template/widget.props.ts.hbs');
const WIDGET_STYLES_TEMPLATE = loadTemplate('./widget-template/widget.styles.ts.hbs');
const WIDGET_STYLE_DEF_TEMPLATE = loadTemplate('./widget-template/widget.styledef.ts.hbs');
const WIDGET_TRANSFORMER_TEMPLATE = loadTemplate('./widget-template/widget.transformer.ts.hbs');
const WIDGET_SPEC_TEMPLATE = loadTemplate('./widget-template/widget.component.spec.tsx.hbs');

function writeFile(path, content) {
    const parent = path.substring(0, path.lastIndexOf('/'));
    if (!fs.existsSync(parent)) {
        fs.mkdirSync(parent, {recursive : true});
    }
    fs.writeFileSync(path, content);
};

function writeStyleDefinition(componentName, group) {
    const styledefProviderPath = `${__dirname}/../../wavemaker-rn-codegen/src/theme/components/style-definition.provider.ts`;
    const cComponentName = capitalize(camelCase(componentName));
    const styledefProvider = fs.readFileSync(styledefProviderPath, 'utf-8')
        .replace('//ADD_STYLE_IMPORT', 
            `import ${cComponentName}StyleDef from './${group}/${componentName}.styledef';\n//ADD_STYLE_IMPORT`)
        .replace('//ADD_STYLE_DEF', 
            `['${group}', ${cComponentName}StyleDef.getStyleDefs()],\n//ADD_STYLE_DEF`);
    const def = WIDGET_STYLE_DEF_TEMPLATE({
        name: componentName,
        baseStylePath: group.split('/').map((s, i) => '../').join('')
    });
    writeFile(`${__dirname}/../../wavemaker-rn-codegen/src/theme/components/${group}/${componentName}.styledef.ts`, def);
    writeFile(styledefProviderPath, styledefProvider);
    return styledefProvider;
}

function writeDesignToken(componentName, group) {
    const designTokenProviderPath = `${__dirname}/../../wavemaker-rn-codegen/src/theme/components/design-token.provider.ts`;
    const cComponentName = capitalize(camelCase(componentName));
    const designTokenProvider = fs.readFileSync(designTokenProviderPath, 'utf-8')
        .replace('//ADD_DESIGN_TOKEN_IMPORT', 
            `import ${cComponentName}StyleDef from './${group}/${componentName}.styledef';\n//ADD_DESIGN_TOKEN_IMPORT`)
        .replace('//REGISTER_DESIGN_TOKEN', 
            `['${group}', ${cComponentName}StyleDef.getDesignTokens?.()],\n//REGISTER_DESIGN_TOKEN`);
    const def = WIDGET_STYLE_DEF_TEMPLATE({
        name: componentName,
        baseStylePath: group.split('/').map((s, i) => '../').join('')
    });
    writeFile(designTokenProviderPath, designTokenProvider);
    return designTokenProvider;
}

yargs(hideBin(process.argv)).command('generate',
    'generates a wavemaker widget',
    (yargs) => {
        yargs.option('name', {
            'describe': 'name of the widget',
            'requiresArg': true
        });
        yargs.positional('group', {
            'describe': 'group to which this widget belongs',
            'requiresArg': true
        });
    }, (argv) => {
        var cName = argv.name.replace(/-([a-z])/g, g => g[1].toUpperCase());
        cName = cName[0].toUpperCase() + cName.slice(1);
        var info = {
            widget: {
                name: {
                    camelcase: cName,
                    hyphenated: argv.name
                },
                group: argv.group
            }
        };
        var folder = `${__dirname}/../src/components/${argv.group}/${argv.name}`;
        var specFolder = `${__dirname}/../test/components/${argv.group}`;
        var codegen = `${__dirname}/../../wavemaker-rn-codegen/src/transpile/components/${argv.group}`;
        var registerFile = `${__dirname}/../../wavemaker-rn-codegen/src/transpile/components/transform-register.ts`;
        writeFile(`${folder}/${argv.name}.component.tsx`, WIDGET_COMPONENT_TEMPLATE(info));
        writeFile(`${folder}/${argv.name}.props.ts`,WIDGET_PROPS_TEMPLATE(info));
        writeFile(`${folder}/${argv.name}.styles.ts`,WIDGET_STYLES_TEMPLATE(info));
        writeFile(`${codegen}/${argv.name}.transformer.ts`,WIDGET_TRANSFORMER_TEMPLATE(info));
        writeFile(`${specFolder}/${argv.name}.component.spec.tsx`,WIDGET_SPEC_TEMPLATE(info));
        var content = fs.readFileSync(registerFile, 'utf-8')
            .replace('//#IMPORT_STATEMENT', 
                `import ${info.widget.name.camelcase}Transformer from './${info.widget.group}/${info.widget.name.hyphenated}.transformer';\n//#IMPORT_STATEMENT`)
            .replace('//#REGISTER_COMPONENT', 
                `registerTransformer('wm-${info.widget.name.hyphenated}', ${info.widget.name.camelcase}Transformer);\n\t//#REGISTER_COMPONENT`);
        writeFile(registerFile, content);
        writeStyleDefinition(argv.name, argv.group);
        writeDesignToken(argv.name, argv.group);
    }).showHelpOnFail().argv;