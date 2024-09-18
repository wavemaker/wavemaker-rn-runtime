import React from "react";

export interface UI_PREFERENCES {
    enableRipple: boolean;
}
  
const UIPreferencesContext = React.createContext<UI_PREFERENCES>({enableRipple: true});

export const UIPreferencesProvider = UIPreferencesContext.Provider;
export const UIPreferencesConsumer = UIPreferencesContext.Consumer;