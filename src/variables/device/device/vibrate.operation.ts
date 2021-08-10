import { Vibration } from 'react-native';
import { Operation, Output } from "@wavemaker/app-rn-runtime/variables/device/operation.provider";

export interface VibrateInput {
  vibrationtime: number;
}

export class VibrateOperation implements Operation {

  public invoke(params: VibrateInput): Promise<Output> {
    Vibration.vibrate(params.vibrationtime * 1000);
    return Promise.resolve({} as Output);
  }
}
