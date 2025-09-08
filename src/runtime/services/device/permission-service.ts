import React from 'react';

export interface PermissionService {
  requestPermissions: (type: string) => Promise<void>;
}

const PermissionContext = React.createContext<PermissionService>(null as any);

export const PermissionProvider = PermissionContext.Provider;
export const PermissionConsumer = PermissionContext.Consumer;
