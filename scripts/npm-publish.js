const fs = require('fs');
const execa = require('execa');
const readline = require('readline');

async function readVersion() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((res) => {
        rl.question('Enter the Version: ', (version) => {
            res(version);
            rl.close();
        });
    });
}

async function publishPatch() {
    const version = await readVersion();
    const packageFolder = `${__dirname}/../dist/npm-packages/app-rn-runtime`;
    const packageJSON = JSON.parse(fs.readFileSync(`${packageFolder}/package.json`));
    packageJSON.version = version;
    fs.writeFileSync(`${packageFolder}/package.json`, JSON.stringify(packageJSON, null, 2));
    await execa('npm', ['publish', packageFolder], {
        cwd: packageFolder,
        stdin: process.stdin,
        stdio: process.stdio,
        stdout: process.stdout,
        stderr: process.stderr
    });
}

publishPatch();