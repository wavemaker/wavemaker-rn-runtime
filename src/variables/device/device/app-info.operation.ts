import React from "react";
import { Operation } from "@wavemaker/app-rn-runtime/variables/device/operation.provider";

export interface AppInfoOutput {
  appversion: string;
  reactversion: string;
}

export class AppInfoOperation implements Operation {
  constructor(private data: {appVersion: string}) {
  }

  public invoke(): Promise<AppInfoOutput> {
    return Promise.resolve({
      appversion: this.data.appVersion,
      reactversion: React.version
    });
  }
}
