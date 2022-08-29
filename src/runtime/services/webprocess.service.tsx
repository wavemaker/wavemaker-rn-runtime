import axios from "axios";
import React, { Component } from "react";
import { Dimensions, View } from "react-native";

import WmWebview from "@wavemaker/app-rn-runtime/components/advanced/webview/webview.component";
import AppConfig from "@wavemaker/app-rn-runtime/core/AppConfig";
import injector from "@wavemaker/app-rn-runtime/core/injector";

import AppDisplayManagerService from "./app-display-manager.service";

declare const window: any, document: any, alert: any;

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class WebProcessWebViewProps {
    src: string = "";
    process: string = "";
    incognito = false;
    onComplete?: (output: string) => any = null as any;
}
  
class WebProcessWebView extends Component<WebProcessWebViewProps> {

    constructor(props: WebProcessWebViewProps) {
      super(props);
    }

    private getScriptToInject(process: string): string {
        return `(function() {
            var elements = document.querySelectorAll('body.flex>a.link');
            for (var i = 0; i < elements.length; i++) {
                var href = elements[i].href;
                if (href && href.indexOf('://services/webprocess/${process}?process_output=')) {
                    return href.split('process_output=')[1];
                }
            }
            window.isWebLoginProcess = true;
        })()`;
    }

    render() {
      return(
        <View style={{
          width: windowWidth,
          height: windowHeight
        }}>
          <WmWebview src={this.props.src}
            incognito={this.props.incognito}
            title=""
            styles={{
            root: {
              width: '100%',
              height: '100%'
            }
          }}
          onLoad={(e, w) => {
            setTimeout(() => {
              w.injectJavaScript(this.getScriptToInject(this.props.process))
              .then((output) => {
                  if (output) {
                    const onComplete = this.props.onComplete;
                    onComplete && onComplete(output as string);
                  }
              });
            }, 1000);
          }}></WmWebview>
        </View>
      );
    }
}

export class WebProcessService {

    baseUrl: string | null = null;

    constructor() {}

    public execute(process: string, hookUrl: string, useSystemBrowser = false, incognito = false): Promise<any> {
        if (!this.baseUrl) {
            this.baseUrl = injector.get<AppConfig>('APP_CONFIG').url;
          }
        return axios.get(this.baseUrl + `/services/webprocess/prepare?processName=${process}&hookUrl=${hookUrl}&requestSourceType=MOBILE`, {
          withCredentials: true
        })
            .then((response) => {
                if (useSystemBrowser) {
                    return this.executeWithSystemBrowser(response.data);
                } else {
                    return this.executeWithInAppBrowser(response.data, process, incognito);
                }
            }).then(output => {
                return axios.get(this.baseUrl + '/services/webprocess/decode?encodedProcessdata=' + output, {
                  withCredentials: true
                });
            });
    }

    private executeWithSystemBrowser(processInfo: string): Promise<any> {
        return Promise.reject('Web Process in System browser is nor ready yet');
    }

    private executeWithInAppBrowser(processInfo: string, process: string, incognito: boolean): Promise<any> {
        return new Promise((resolve, reject) => {
            let destroyFn = () => {};
            destroyFn = AppDisplayManagerService.show({
                content: (
                  <WebProcessWebView 
                    src={this.baseUrl  + '/services/webprocess/start?process=' + encodeURIComponent(processInfo)}
                    incognito={incognito}
                    process={process}
                    onComplete={(ouput) => {
                      resolve(ouput);
                      destroyFn.call(AppDisplayManagerService);
                    }}></WebProcessWebView>
                ),
                
              });
        });
    }
}

export default new WebProcessService();