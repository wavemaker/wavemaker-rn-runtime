const fs = require('fs-extra');
const projectDir = '.';
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const tar = require('tar');
const execa = require('execa');
const path = require("path");

async function createPackageLock(path) {
  await execa('npm', ['install', '--package-lock-only'], {
    'cwd': path
  });
  const expoPackageJSON = fs.readJSONSync(`${path}/package-lock.json`);
  Object.values(expoPackageJSON.packages || {}).map(v => {
    delete v.resolved;
  });
  fs.writeJSONSync(`${path}/package-lock.json`, expoPackageJSON, {
    spaces: 4
  });
}

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
    //there is this dependency already present in the dependencies. why again in devDependencies?
    // packageData['devDependencies']['@wavemaker/variables'] = runtimeVersion;
    packageData.exports = {
      "./": "./"
    };
    delete packageData['files'];
    fs.writeFileSync(`${projectDir}/dist/module/package.json`, JSON.stringify(packageData, null, 2))
    await updatePackageVersion(`${projectDir}/dist/module/package.json`, 'version', runtimeVersion);
    console.log('Post Build successful!!!');
}

async function prepareNpmPackages(runtimeVersion) {
  let tarballName = `wavemaker-app-rn-runtime-${runtimeVersion}.tgz`
  fs.copySync(`${projectDir}/dist/module`, `${projectDir}/dist/npm-packages/package`, {
    filter: p => !p.startsWith('/node_modules/')
  });
  // generate package lock
  await createPackageLock(`${projectDir}/dist/npm-packages/package`);
  await execa('tar', ['-czf', `dist/npm-packages/${tarballName}`, '-C', 'dist/npm-packages', 'package'], {
    'cwd': `${projectDir}`
  });
  let tarballPath = path.join(__dirname, `../dist/npm-packages/${tarballName}`)
  const {stdout} = await execa('node', ['../process-npm-package-stats.js', `--path=${tarballPath}`, '--packageName=@wavemaker/app-rn-runtime', `--publishVersion=${runtimeVersion}`]);
  console.log(stdout);
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
