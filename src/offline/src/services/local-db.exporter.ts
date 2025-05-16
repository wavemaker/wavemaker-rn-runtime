/**
     * This function will export the databases in a zip format.
     *
     * @returns {object} a promise that is resolved when zip is created.
     */
    // public exportDB(): Promise<string> {
    //     return new Promise<string>((resolve, reject) => {
    //         const folderToExport = 'offline_temp_' + now(),
    //             folderToExportFullPath = cordova.file.cacheDirectory + folderToExport + '/',
    //             zipFileName = '_offline_data.zip',
    //             metaInfo = {
    //                 app: null,
    //                 OS: '',
    //                 createdOn: 0
    //             };
    //         let zipDirectory;
    //         if (isIos()) {
    //             // In IOS, save zip to documents directory so that user can export the file from IOS devices using iTUNES.
    //             zipDirectory = cordova.file.documentsDirectory;
    //         } else {
    //             // In Android, save zip to download directory.
    //             zipDirectory = cordova.file.externalRootDirectory + 'Download/';
    //         }
    //         // Create a temporary folder to copy all the content to export
    //         this.file.createDir(cordova.file.cacheDirectory, folderToExport, false)
    //             .then(() => {
    //                 // Copy databases to temporary folder for export
    //                 return this.file.copyDir(this.dbInstallParentDirectory, this.dbInstallDirectoryName, folderToExportFullPath, 'databases')
    //                     .then(() => {
    //                         // Prepare meta info to identify the zip and other info
    //                         return this.getAppInfo();
    //                     }).then(appInfo => {
    //                         metaInfo.app = (appInfo as any);
    //                         if (isIos()) {
    //                             metaInfo.OS = 'IOS';
    //                         } else if (isAndroid()) {
    //                             metaInfo.OS = 'ANDROID';
    //                         }
    //                         metaInfo.createdOn = now();
    //                         return metaInfo;
    //                     }).then(() => executePromiseChain(this.getCallbacksFor('preExport'), [folderToExportFullPath, metaInfo]))
    //                     .then(() => {
    //                         // Write meta data to META.json
    //                         return this.file.writeFile(folderToExportFullPath, 'META.json', JSON.stringify(metaInfo));
    //                     });
    //             }).then(() => {
    //                 // Prepare name to use for the zip.
    //                 let appName = metaInfo.app.name;
    //                 appName = appName.replace(/\s+/g, '_');
    //                 return this.deviceFileService.newFileName(zipDirectory, appName + zipFileName)
    //                     .then(fileName => {
    //                         // Zip the temporary folder for export
    //                         return new Promise((rs, re) => {
    //                             Zeep.zip({
    //                                 from : folderToExportFullPath,
    //                                 to   : zipDirectory + fileName
    //                             }, () => rs(zipDirectory + fileName), re);
    //                         });
    //                     });
    //             }).then(resolve, reject)
    //             .catch(noop).then(() => {
    //                 // Remove temporary folder for export
    //                 return this.deviceFileService.removeDir(cordova.file.cacheDirectory + folderToExport);
    //             });
    //     });
    // }


        // /**
        //  * Returns a promise that is resolved with application info such as packageName, appName, versionNumber, versionCode.
        //  * @returns {*}
        //  */
        // private getAppInfo() {
        //     const appInfo = {
        //         name: '',
        //         packageName: '',
        //         versionNumber: '',
        //         versionCode: null
        //     };
        //     return this.appVersion.getPackageName()
        //         .then(packageName => {
        //             appInfo.packageName = packageName;
        //             return this.appVersion.getAppName();
        //         }).then(appName => {
        //             appInfo.name = appName;
        //             return this.appVersion.getVersionNumber();
        //         }).then(versionNumber => {
        //             appInfo.versionNumber = versionNumber;
        //             return this.appVersion.getVersionCode();
        //         }).then(versionCode => {
        //             appInfo.versionCode = (versionCode as any);
        //             return appInfo;
        //         });
        // }