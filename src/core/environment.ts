import RNRestart from 'react-native-restart';
import { DevSettings } from 'react-native'
import Constants from 'expo-constants';

import StorageService from "./storage.service";

export const CURRENT_ENVIRONMENT = 'currentEnvironment'

class Environment {
    private env: string;
    constructor() {
        this.init();
        this.env = "";
    }

    private async init() {
        setImmediate(() => {
            const defaultValue = __DEV__ ? 'development' : 'deployment';
            StorageService.getItem(CURRENT_ENVIRONMENT).then((currentEnv) => {
                this.env = currentEnv ?? defaultValue;
            });
        })
    }

    getCurrent() {
        return this.env
    }

    setCurrent(env: string) {
        StorageService.setItem(CURRENT_ENVIRONMENT, env).then(() => {
            if(Constants.executionEnvironment === 'storeClient') {
                DevSettings.reload();
            } else {
                RNRestart.restart();
            }
        })
    }

    getCurrentAsync() {
        return StorageService.getItem(CURRENT_ENVIRONMENT);
    }
}

export default new Environment();

