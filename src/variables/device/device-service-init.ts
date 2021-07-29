import { CameraService } from "@wavemaker/app-rn-runtime/variables/device/camera-service";
import { DeviceVariableService } from "@wavemaker/app-rn-runtime/variables/device/device-variable-service";

export let dvService= new DeviceVariableService();

export default {
  get() {
    if (!dvService) {
      dvService= new DeviceVariableService();
    }
    return dvService;
  },
  initialize() {
    dvService.registerService(new CameraService());
  }
}
