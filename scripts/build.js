const fs = require('fs-extra');
const projectDir = '.';
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');

async function updatePackageVersion(packagePath, key, version) {
    let content = fs.readFileSync(packagePath, 'utf8');
    content = content.replace(new RegExp(`"${key}"\\s*:\\s*"[^"]*"`), `"${key}": "${version}"`);
    fs.writeFileSync(packagePath, content);
}

async function postBuild(runtimeVersion) {
    fs.copySync(`${projectDir}/lib/module`, `${projectDir}/dist/module`);
    fs.copySync(`${projectDir}/package.json`, `${projectDir}/dist/module/package.json`);
    await updatePackageVersion(`${projectDir}/dist/module/package.json`, 'version', runtimeVersion);
    console.log('Post Build successful!!!');
}

yargs(hideBin(process.argv)).command('post-build',
    'to run post processing after project build',
    (yargs) => {
        yargs.option('runtimeVersion', {
            describe: 'version number',
            type: 'string',
            default: '1.0.0-dev'
        });
    }, (argv) => {
        postBuild(argv.runtimeVersion);
    }).showHelpOnFail().argv;
