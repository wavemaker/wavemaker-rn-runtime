import React, { ReactNode }  from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { merge } from 'lodash';
import WmModal from '@wavemaker/app-rn-runtime/components/basic/modal/modal.component';
import AppConfig, { Drawer } from '@wavemaker/app-rn-runtime/core/AppConfig';
import injector from '@wavemaker/app-rn-runtime/core/injector';
import { ModalProvider } from '@wavemaker/app-rn-runtime/core/modal.service';
import { PartialProvider } from '@wavemaker/app-rn-runtime/core/partial.service';

import AppModalService from './services/app-modal.service';
import AppPartialService from './services/partial.service';
import { AppNavigator } from './App.navigator';

const MAX_TIME_BETWEEN_REFRESH_CYCLES = 200;

class DrawerImpl implements Drawer {
  content: ReactNode;
  animation: string = 'slide-in';

  constructor(private onChange: () => void) {

  }

  setContent(content: ReactNode) {
    this.content = content;
    this.onChange();
  }

  getContent() {
    return this.content;
  }

  setAnimation(animation: string) {
    this.animation = animation;
    this.onChange();
  }

  getAnimation() {
    return this.animation;
  }
}

export default abstract class BaseApp extends React.Component {

  Actions: any = {};
  Variables: any = {};
  onAppVariablesReady = () => {};
  appStarted = false;
  appConfig = injector.get<AppConfig>('APP_CONFIG');
  private startUpVariables: string[] = [];
  private autoUpdateVariables: string[] = [];

  constructor(props: any) {
    super(props);
    this.appConfig.app = this;
    this.appConfig.drawer = new DrawerImpl(() => this.setState({'t': Date.now()}));
    let refreshAfterWait = false;
    let wait = 0;
    this.appConfig.refresh = () => {
      if (!wait) {
        wait = MAX_TIME_BETWEEN_REFRESH_CYCLES;
        refreshAfterWait = false;
        setTimeout(() => {
          this.forceUpdate();
          this.appConfig.currentPage?.forceUpdate();
        });
        setTimeout(() => {
          wait = 0;
          refreshAfterWait && this.appConfig.refresh();
        }, wait);
      } else {
        refreshAfterWait = true;
      }
    }
  }

  eval(fn: Function, failOnError = false) {
    try {
      return fn.call(this);
    } catch (e) {
      if (failOnError) {
        throw e;
      } else {
        return null;
      }
    }
  }

  componentDidMount() {
    Promise.all(this.startUpVariables.map(s => this.Variables[s] && this.Variables[s].invoke()))
      .then(() => {
      this.onAppVariablesReady();
      this.appStarted = true;
      this.appConfig.refresh();
    });
  }

  refresh() {
    this.appConfig.refresh();
  }

  render() {
    return (
      <SafeAreaProvider>
        <View  style={styles.container}>
          { this.appConfig.loadApp && this.appStarted && (
            <PartialProvider value={AppPartialService}>
              <ModalProvider value={AppModalService}>
                <View style={styles.container}>
                  <AppNavigator 
                    app={this} 
                    drawerContent={() => this.appConfig.drawer?.getContent()}
                    drawerAnimation={this.appConfig.drawer?.getAnimation()}></AppNavigator>
                  {AppModalService.modalOptions.content && 
                    (<WmModal 
                      styles={{
                        root : merge(styles.appModal, AppModalService.modalOptions.modalStyle),
                        content: AppModalService.modalOptions.contentStyle,
                      }}>
                        {AppModalService.modalOptions.content}
                    </WmModal>)}
                </View>
              </ModalProvider>
            </PartialProvider>)
          }
        </View>
      </SafeAreaProvider>
    );
  }
}

const styles = {
  container: {
    flex: 1
  },
  appModal: {
    position: 'absolute',
    top: 0,
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  }
};
