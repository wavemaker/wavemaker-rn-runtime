const fs = require('fs-extra');
const projectDir = '.';
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const tar = require('tar');
const execa = require('execa');

async function updatePackageVersion(packagePath, key, version) {
    let content = fs.readFileSync(packagePath, 'utf8');
    content = content.replace(new RegExp(`"${key}"\\s*:\\s*"[^"]*"`), `"${key}": "${version}"`);
    fs.writeFileSync(packagePath, content);
}

async function postBuild(runtimeVersion) {
    fs.copySync(`${projectDir}/lib/module`, `${projectDir}/dist/module`);
    fs.copySync(`${projectDir}/package.json`, `${projectDir}/dist/module/package.json`);
    const packageData = fs.readJSONSync(`${projectDir}/package.json`, {
        encoding: "utf8"
    });
    packageData.main = 'index';
    packageData.module = 'index';
    packageData['devDependencies']['@wavemaker/variables'] = runtimeVersion;
    packageData.exports = {
      "./": "./"
    };
    delete packageData['files'];
    fs.writeFileSync(`${projectDir}/dist/module/package.json`, JSON.stringify(packageData, null, 2))
    await updatePackageVersion(`${projectDir}/dist/module/package.json`, 'version', runtimeVersion);
    console.log('Post Build successful!!!');
}

async function prepareNpmPackages(runtimeVersion) {
    fs.copySync(`${projectDir}/dist/module`, `${projectDir}/dist/npm-packages/app-rn-runtime`, {
        filter: p => !p.startsWith('/node_modules/')
    });
    //this check is required for repeat builds in local builds to avoid unnecessary copy time
    if(!fs.existsSync(`${projectDir}/node_modules/.bin`)) {
      fs.copySync(`${projectDir}/node_modules`, `${projectDir}/dist/npm-packages/app-rn-runtime/node_modules`);
    }
    await execa('npm', ['pack'], {
        'cwd': `${projectDir}/dist/npm-packages/app-rn-runtime`
    });
    fs.copySync(`${projectDir}/dist/npm-packages/app-rn-runtime/wavemaker-app-rn-runtime-${runtimeVersion}.tgz`, `${projectDir}/dist/npm-packages/wavemaker-app-rn-runtime-${runtimeVersion}.tgz`);
}

async function pushToLocalRepo() {
    fs.writeFileSync(`${projectDir}/dist/new-build`, '' + Date.now);
    await execa('yalc', ['publish' , '--no-sig', '--push'], {
        'cwd': `${projectDir}/dist/module`
    });
}

yargs(hideBin(process.argv)).command('post-build',
    'to run post processing after project build',
    (yargs) => {
        yargs.option('runtimeVersion', {
            describe: 'version number',
            type: 'string',
            default: '1.0.0-dev'
        }).option('production', {
            describe: 'to perform a production build',
            type: 'boolean',
            default: false
        });
    }, (argv) => {
        postBuild(argv.runtimeVersion).then(() => {
            if (argv.production) {
                return prepareNpmPackages(argv.runtimeVersion);
            } else {
                return pushToLocalRepo();
            }
        });
    }).showHelpOnFail().argv;
