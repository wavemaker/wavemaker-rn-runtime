import * as Network from 'expo-network';
import { Operation } from '@wavemaker/app-rn-runtime/variables/device/operation.provider';

export interface NetworkInfoOutput {
  connectionType: string;
  isNetworkAvailable: boolean;
}

export class NetworkInfoOperation implements Operation {
  public invoke(): Promise<NetworkInfoOutput> {
    return Network.getNetworkStateAsync().then((response) => {
      return {
        connectionType: Network.NetworkStateType[response.type as Network.NetworkStateType],
        isNetworkAvailable: response.isInternetReachable
      } as NetworkInfoOutput;
    });
  }
}
