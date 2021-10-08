import React, { ReactNode }  from 'react';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import {TouchableOpacity, View, ViewStyle} from 'react-native';
import ProtoTypes from 'prop-types';
import { SafeAreaProvider, SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { RENDER_LOGGER } from '@wavemaker/app-rn-runtime/core/logger';
import AppConfig, { Drawer } from '@wavemaker/app-rn-runtime/core/AppConfig';
import injector from '@wavemaker/app-rn-runtime/core/injector';
import formatters from '@wavemaker/app-rn-runtime/core/formatters';
import { deepCopy } from '@wavemaker/app-rn-runtime/core/utils';
import { ModalProvider } from '@wavemaker/app-rn-runtime/core/modal.service';
import { ToastProvider } from '@wavemaker/app-rn-runtime/core/toast.service';
import { NavigationServiceProvider } from '@wavemaker/app-rn-runtime/core/navigation.service';
import { PartialProvider } from '@wavemaker/app-rn-runtime/core/partial.service';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import WmMessage from '@wavemaker/app-rn-runtime/components/basic/message/message.component';
import { Animatedview } from '@wavemaker/app-rn-runtime/components/basic/animatedview.component';

import AppDisplayManagerService from './services/app-display-manager.service';
import AppModalService from './services/app-modal.service';
import AppToastService from './services/app-toast.service';
import AppPartialService from './services/partial.service';
import { AppNavigator } from './App.navigator';
import { SecurityProvider } from '../core/security.service';
import { CameraProvider } from '../core/device/camera-service';
import  CameraService from './services/device/camera-service';
import { ScanProvider } from '../core/device/scan-service';
import ScanService from './services/device/scan-service';
import AppSecurityService from './services/app-security.service';
import {getValidJSON, parseErrors} from '@wavemaker/app-rn-runtime/variables/utils/variable.utils';

import * as SplashScreen from 'expo-splash-screen';

//some old react libraries need this
((View as any)['propTypes'] = { style: ProtoTypes.any})

const MIN_TIME_BETWEEN_REFRESH_CYCLES = 200;

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
  public baseUrl = '';
  private startUpVariables: string[] = [];
  private startUpActions: string[] = [];
  private autoUpdateVariables: string[] = [];
  public formatters = formatters;
  public serviceDefinitions = {} as any;
  private animatedRef: any;

  constructor(props: any) {
    super(props);
    SplashScreen.preventAutoHideAsync();
    this.appConfig.app = this;
    this.appConfig.drawer = new DrawerImpl(() => this.setState({'t': Date.now()}));
    let refreshAfterWait = false;
    this.baseUrl = this.appConfig.url;
    let wait = 0;
    this.bindServiceInterceptors();
    this.appConfig.refresh = () => {
      if (!wait) {
        RENDER_LOGGER.debug('refreshing the app...');
        wait = MIN_TIME_BETWEEN_REFRESH_CYCLES;
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

  onBeforeServiceCall(config: AxiosRequestConfig) {
    console.log('onBeforeService call invoked on ' + config.url);
    return config
  }

  onServiceSuccess(data: any, response: AxiosResponse) {

  }

  onServiceError(errorMsg: any, error: AxiosError<any>) {

  }

  bindServiceInterceptors() {
    axios.interceptors.request.use((config: AxiosRequestConfig) => this.onBeforeServiceCall(config));
    axios.interceptors.response.use(
      (response: AxiosResponse) => {
        this.onServiceSuccess(response.data, response);
        return response;
      },(error: AxiosError<any>) => {
        let errorDetails: any = error.response, errMsg;
        errorDetails = getValidJSON(errorDetails?.data) || errorDetails?.data;
        if (errorDetails && errorDetails.errors) {
            errMsg = parseErrors(errorDetails.errors) || "Service Call Failed";
        } else {
            errMsg = errMsg || "Service Call Failed";
        }
        error.message = errMsg;
        this.onServiceError(error.message, error);
        if (error.response?.config.url?.startsWith(this.appConfig.url) && error.response?.status === 401) {
          this.appConfig.currentPage?.pageName !== 'Login' && this.appConfig.currentPage?.goToPage('Login');
        }
        return Promise.reject(error)
      });
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
      // TODO: Without callback, splashscreen was not getting hidden in ios mobile app. Later, remove the empty function.
      SplashScreen.hideAsync().then(() => {});
    });
    this.startUpActions.map(a => this.Actions[a] && this.Actions[a].invoke());
  }

  refresh() {
    this.appConfig.refresh();
  }

  getProviders(content: React.ReactNode) {
    return (
      <NavigationServiceProvider value={this.appConfig.currentPage}>
        <ToastProvider value={AppToastService}>
          <PartialProvider value={AppPartialService}>
            <SecurityProvider value={AppSecurityService}>
              <CameraProvider value={CameraService}>
                <ScanProvider value={ScanService}>
                  <ModalProvider value={AppModalService}> 
                    { content }         
                  </ModalProvider>
                </ScanProvider>
              </CameraProvider>
            </SecurityProvider>       
          </PartialProvider>
        </ToastProvider>
      </NavigationServiceProvider>
    );
  }

  renderToasters() {
    return (
      <>
        {AppToastService.toastsOpened.map((o, i) =>
          (
            <View key={i} style={[{position: 'absolute', width: '100%'}, o.styles]}>
              <TouchableOpacity onPress={() => o.onClick && o.onClick()}>
                {o.content}
                <WmMessage type={o.type} caption={o.text} hideclose={true}></WmMessage>
              </TouchableOpacity>
            </View>
          )
        )}
      </>);
  }

  renderDialogs(): ReactNode {
    return (
      <>
      {AppModalService.modalOptions.content &&
        AppModalService.modalsOpened.map((o, i) => {
          AppModalService.animatedRef = this.animatedRef;
          return (
            <TouchableOpacity activeOpacity={1} key={i}
                              onPress={() => o.isModal && AppModalService.hideModal(o)}
                              style={deepCopy(styles.appModal,
                                o.centered ? styles.centeredModal: null,
                                o.modalStyle)}>
              <Animatedview entryanimation={o.animation || 'fadeIn'}
                              ref={ref => this.animatedRef = ref}
                              style={[styles.appModalContent, o.contentStyle]}>
                  <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => {}}
                      style={{width: '100%', alignItems: 'center'}}>
                      {this.getProviders(o.content)}
                    </TouchableOpacity>
              </Animatedview>
            </TouchableOpacity>
          )}
        )
      }
    </>);
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
          <SafeAreaInsetsContext.Consumer>
            {(insets = {top: 0, bottom: 0, left: 0, right: 0}) =>
              (this.getProviders(
                (<View style={[styles.container, {paddingTop: insets?.top || 0, paddingBottom: insets?.bottom, paddingLeft: insets?.left, paddingRight : insets?.right}]}>
                  <View style={styles.container}>
                    <AppNavigator
                      app={this}
                      hideDrawer={this.appConfig.drawer?.getContent() === null}
                      drawerContent={() => this.appConfig.drawer? this.getProviders(this.appConfig.drawer.getContent()) : null}
                      drawerAnimation={this.appConfig.drawer?.getAnimation()}></AppNavigator>
                    {AppDisplayManagerService.displayOptions.content
                      ? (<View style={styles.displayViewContainer}>
                        {AppDisplayManagerService.displayOptions.content}
                      </View>) : null}
                  </View>
                </View>))
              )
            }
          </SafeAreaInsetsContext.Consumer>
          {this.renderToasters()}
          {this.renderDialogs()}
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
    flex: 1,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'column'
  },
  centeredModal: {
    flex: 1,
    position: 'absolute',
    top: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    height: '100%'
  },
  displayViewContainer: {
    position: 'absolute',
    width: '100%',
    left: 0,
    right: 0,
    top: 0,
    bottom:0
  } as ViewStyle
};
