import React from "react";

export interface AppLoaderPreferences {
  inheritThemePrimary: boolean;
}

export interface UI_PREFERENCES {
  enableRipple: boolean;
  enableMinTouchArea?: boolean,
  appLoader?: AppLoaderPreferences;
}
  
const UIPreferencesContext = React.createContext<UI_PREFERENCES>({enableRipple: true, appLoader: {inheritThemePrimary: true}, enableMinTouchArea: true});

export const UIPreferencesProvider = UIPreferencesContext.Provider;
export const UIPreferencesConsumer = UIPreferencesContext.Consumer;