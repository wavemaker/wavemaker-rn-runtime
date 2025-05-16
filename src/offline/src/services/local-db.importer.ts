/**
     * This function will replace the databases with the files provided in zip. If import gets failed,
     * then app reverts back to use old databases.
     *
     * @param {string} zipPath location of the zip file.
     * @param {boolean} revertIfFails If true, then a backup is created and when import fails, backup is reverted back.
     * @returns {object} a promise that is resolved when zip is created.
     */
    // public importDB(zipPath: string, revertIfFails: boolean): Promise<void> {
    //     return new Promise<void>((resolve, reject) => {
    //         const importFolder = 'offline_temp_' + now(),
    //             importFolderFullPath = cordova.file.cacheDirectory + importFolder + '/';
    //         let zipMeta;
    //         // Create a temporary folder to unzip the contents of the zip.
    //         this.file.createDir(cordova.file.cacheDirectory, importFolder, false)
    //             .then( () => {
    //                 return new Promise<void>((rs, re) => {
    //                     // Unzip to temporary location
    //                     Zeep.unzip({
    //                         from: zipPath,
    //                         to: importFolderFullPath
    //                     }, rs, re);
    //                 });
    //             }).then(() => {
    //             /*
    //              * read meta data and allow import only package name of the app from which this zip is created
    //              * and the package name of this app are same.
    //              */
    //             return this.file.readAsText(importFolderFullPath, 'META.json')
    //                 .then(text => {
    //                 zipMeta = JSON.parse(text);
    //                 return this.getAppInfo();
    //             }).then(appInfo => {
    //                 if (!zipMeta.app) {
    //                     return Promise.reject('meta information is not found in zip');
    //                 }
    //                 if (zipMeta.app.packageName !== appInfo.packageName) {
    //                     return Promise.reject('database zip of app with same package name can only be imported');
    //                 }
    //             });
    //         }).then(() => {
    //             let backupZip;
    //             return this.close()
    //                 .then(() => {
    //                     if (revertIfFails) {
    //                         // create backup
    //                         return this.exportDB()
    //                             .then(path => backupZip = path);
    //                     }
    //                 }).then(() => {
    //                     // delete existing databases
    //                     return this.deviceFileService.removeDir(this.dbInstallDirectory);
    //                 }).then(() => {
    //                     // copy imported databases
    //                     return this.file.copyDir(importFolderFullPath, 'databases', this.dbInstallParentDirectory, this.dbInstallDirectoryName);
    //                 }).then(() => {
    //                     // reload databases
    //                     this.databases = null;
    //                     return this.loadDatabases();
    //                 }).then(() => executePromiseChain(this.getCallbacksFor('postImport'), [importFolderFullPath, zipMeta]))
    //                 .then(() => {
    //                     if (backupZip) {
    //                         return this.deviceFileService.removeFile(backupZip);
    //                     }
    //                 }, (reason) => {
    //                     if (backupZip) {
    //                         return this.importDB(backupZip, false)
    //                             .then(() => {
    //                                 this.deviceFileService.removeFile(backupZip);
    //                                 return Promise.reject(reason);
    //                             });
    //                     }
    //                     return Promise.reject(reason);
    //                 });
    //         }).then(resolve, reject)
    //         .catch(noop)
    //         .then(() => {
    //             return this.deviceFileService.removeDir(cordova.file.cacheDirectory + importFolder);
    //         });
    //     });
    // }