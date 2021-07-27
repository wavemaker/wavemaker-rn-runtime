import React, { ReactNode }  from 'react';
import { TouchableOpacity, View } from 'react-native';
import ProtoTypes from 'prop-types';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { RENDER_LOGGER } from '@wavemaker/app-rn-runtime/core/logger';
import AppConfig, { Drawer } from '@wavemaker/app-rn-runtime/core/AppConfig';
import injector from '@wavemaker/app-rn-runtime/core/injector';
import { deepCopy } from '@wavemaker/app-rn-runtime/core/utils';
import { ModalProvider } from '@wavemaker/app-rn-runtime/core/modal.service';
import { NavigationServiceProvider } from '@wavemaker/app-rn-runtime/core/navigation.service';
import { PartialProvider } from '@wavemaker/app-rn-runtime/core/partial.service';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

import AppModalService from './services/app-modal.service';
import AppPartialService from './services/partial.service';
import { AppNavigator } from './App.navigator';

//some old react libraries need this
((View as any)['propTypes'] = { style: ProtoTypes.any})

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
  isStarted = false;
  appConfig = injector.get<AppConfig>('APP_CONFIG');
  private startUpVariables: string[] = [];
  private startUpActions: string[] = [];
  private autoUpdateVariables: string[] = [];

  constructor(props: any) {
    super(props);
    this.appConfig.app = this;
    this.appConfig.drawer = new DrawerImpl(() => this.setState({'t': Date.now()}));
    let refreshAfterWait = false;
    let wait = 0;
    this.appConfig.refresh = () => {
      if (!wait) {
        RENDER_LOGGER.debug('refreshing the app...');
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
        RENDER_LOGGER.debug('will refresh the app in the next cycle.');
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
      this.isStarted = true;
      this.appConfig.refresh();
    });
    this.startUpActions.map(a => this.Actions[a] && this.Actions[a].invoke());
  }

  refresh() {
    this.appConfig.refresh();
  }

  render() {
    return (
      <SafeAreaProvider>
        <PaperProvider theme={{
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            primary: ThemeVariables.primaryColor
          }}}>
          <NavigationServiceProvider value={this.appConfig.currentPage}>
              <PartialProvider value={AppPartialService}>
                <View  style={styles.container}>
                  <ModalProvider value={AppModalService}>
                    <View style={styles.container}>
                      <AppNavigator
                        app={this}
                        hideDrawer={this.appConfig.drawer?.getContent() === null}
                        drawerContent={() => this.appConfig.drawer?.getContent()}
                        drawerAnimation={this.appConfig.drawer?.getAnimation()}></AppNavigator>
                    </View>
                  </ModalProvider>
                </View>
                {AppModalService.modalOptions.content && 
                  AppModalService.modalsOpened.map((o, i) =>
                    (
                    <TouchableOpacity activeOpacity={1} key={i} 
                      onPress={() => o.isModal && AppModalService.hideModal(o)}
                      style={deepCopy(styles.appModal, 
                        o.centered ? styles.centeredModal: null,
                        o.modalStyle)}>
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => {}}
                            style={[styles.appModalContent, o.contentStyle]}>
                              {o.content}
                          </TouchableOpacity>
                    </TouchableOpacity>
                    )
                  )
                }
            </PartialProvider>
          </NavigationServiceProvider>
        </PaperProvider>
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
    width: '100%'
  },
  appModalContent : {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'column'
  },
  centeredModal: {
    flex: 1,
    position: 'absolute',
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    height: '100%'
  },
};
