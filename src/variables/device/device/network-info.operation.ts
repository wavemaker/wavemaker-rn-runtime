import * as Network from 'expo-network';
import { Operation } from '@wavemaker/app-rn-runtime/variables/device/operation.provider';
import NetworkService from '@wavemaker/app-rn-runtime/core/network.service';

import { DeviceVariable } from '../../device-variable';

export interface NetworkInfoOutput {
  connectionType: string;
  isConnecting: boolean;
  isNetworkAvailable: boolean;
  isOnline: boolean;
  isOffline: boolean;
}

export class NetworkInfoOperation implements Operation {
  isOnline = true;

  public invoke(params?: any, onSuccess?: Function, onError?: Function, operation?: string, variable?: DeviceVariable): Promise<NetworkInfoOutput> {
    const networkState = params.networkStatus;
    return Network.getNetworkStateAsync().then((response) => {
      return {
        connectionType: Network.NetworkStateType[response.type as Network.NetworkStateType],      
        isConnecting: networkState.isConnecting,
        isNetworkAvailable: networkState.isNetworkAvailable,
        isOnline: networkState.isConnected,
        isOffline: !networkState.isConnected
      } as NetworkInfoOutput;
    }).then((dataset) => {
      try {
        if (this.isOnline !== networkState.isConnected) {
          this.isOnline = networkState.isConnected;
          const callback = (variable?.config as any)[networkState.isConnected ? 'onOnline' : 'onOffline'] as Function;
          callback?.(variable, dataset);
        }
      } catch(e) {
        console.error(e);
      }
      return dataset;
    });
  }
}
