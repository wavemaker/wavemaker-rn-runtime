import Constants from "expo-constants";

import Environment from "./environment";

class Env {
    get(key: string): string | null {
        const currentEnv = Environment.getCurrent() ? Environment.getCurrent() : 
            __DEV__ ? 'development' : 'deployment';

        if(Constants.expoConfig?.extra?.profileConfig?.[currentEnv]?.environment?.[key]) {
            return Constants.expoConfig.extra.profileConfig[currentEnv].environment[key];
        }

        return null;
    }
}

export default new Env();
