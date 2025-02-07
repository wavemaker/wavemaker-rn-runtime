import React, { ReactNode }  from 'react';
import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { Platform, TouchableOpacity, View, ViewStyle, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ProtoTypes from 'prop-types';
import { SafeAreaProvider, SafeAreaInsetsContext, SafeAreaView } from 'react-native-safe-area-context';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Linking } from 'react-native';
import { NativeModulesProxy } from 'expo-modules-core';
import * as WebBrowser from 'expo-web-browser';
import { get, last } from 'lodash';
import { RENDER_LOGGER } from '@wavemaker/app-rn-runtime/core/logger';
import EventNotifier from '@wavemaker/app-rn-runtime/core/event-notifier';
import { ThemeProvider } from '@wavemaker/app-rn-runtime/styles/theme';
import AppConfig, { Drawer } from '@wavemaker/app-rn-runtime/core/AppConfig';
import StorageService from '@wavemaker/app-rn-runtime/core/storage.service';
import ConstantService from '@wavemaker/app-rn-runtime/core/constant.service';
import NetworkService, { NetworkState } from '@wavemaker/app-rn-runtime/core/network.service';
import injector from '@wavemaker/app-rn-runtime/core/injector';
import formatters from '@wavemaker/app-rn-runtime/core/formatters';
import { deepCopy, isWebPreviewMode } from '@wavemaker/app-rn-runtime/core/utils';
import * as Utils  from '@wavemaker/app-rn-runtime/core/utils';
import { ModalProvider } from '@wavemaker/app-rn-runtime/core/modal.service';
import { ToastProvider } from '@wavemaker/app-rn-runtime/core/toast.service';
import NavigationService, { NavigationServiceProvider } from '@wavemaker/app-rn-runtime/core/navigation.service';
import { PartialProvider } from '@wavemaker/app-rn-runtime/core/partial.service';
import WmNetworkInfoToaster from '@wavemaker/app-rn-runtime/components/advanced/network-info-toaster/network-info-toaster.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import WmMessage from '@wavemaker/app-rn-runtime/components/basic/message/message.component';
import { Animatedview } from '@wavemaker/app-rn-runtime/components/basic/animatedview.component';
import AppI18nService from '@wavemaker/app-rn-runtime/runtime/services/app-i18n.service';

import { Watcher } from './watcher';
import { preparePatch } from './lib-patch';
import AppDisplayManagerService from './services/app-display-manager.service';
import AppModalService from './services/app-modal.service';
import AppToastService from './services/app-toast.service';
import AppPartialService from './services/partial.service';
import AppSpinnerService from './services/app-spinner.service';
import { AppNavigator } from './App.navigator';
import { SecurityProvider } from '../core/security.service';
import { CameraProvider } from '../core/device/camera-service';
import  CameraService from './services/device/camera-service';
import { ScanProvider } from '../core/device/scan-service';
import ScanService from './services/device/scan-service';
import AppSecurityService from './services/app-security.service';
import {getValidJSON, parseErrors} from '@wavemaker/app-rn-runtime/variables/utils/variable.utils';
import MaterialCommunityIconsFont from '@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf';

import * as SplashScreen from 'expo-splash-screen';
import BasePartial from './base-partial.component';
import BasePage from './base-page.component';
import { WmMemo } from './memo.component';
import { BaseVariable, VariableEvents } from '../variables/base-variable';

declare const window: any;

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
const SUPPORTED_SERVICES = {
  Utils: Utils,
  CONSTANTS: ConstantService,
  StorageService: StorageService,
  AppDisplayManagerService: AppDisplayManagerService,
  i18nService: AppI18nService
};
(global as any)['axios'] = axios;
export default abstract class BaseApp extends React.Component implements NavigationService {

  Actions: any = {};
  Variables: any = {};
  onAppVariablesReady = () => {};
  isStarted = false;
  appConfig = injector.get<AppConfig>('APP_CONFIG');
  private eventNotifier = new EventNotifier();
  public baseUrl = '';
  public targetPlatform = 'NATIVE_MOBILE';
  public cleanup = [] as Function[];
  public commonPartial: BasePartial = null as any;
  private startUpVariables: string[] = [];
  private startUpActions: string[] = [];
  private autoUpdateVariables: string[] = [];
  private axiosInterceptorIds: number[] = [];
  public formatters = formatters;
  public serviceDefinitions = {} as any;
  private animatedRef: any;
  public modalsOpened: number = 0;
  public toastsOpened: number = 0;
  public watcher: Watcher = Watcher.ROOT;
  public paperTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: ThemeVariables.INSTANCE.primaryColor
    }
  };
  public lib = preparePatch(() => {
    this.refresh();
  });

  public networkStatus = {} as NetworkState;
  public statusbarInsets:any;

  constructor(props: any) {
    super(props);
    SplashScreen.preventAutoHideAsync();
    setTimeout(() => SplashScreen.hideAsync(), 10000);
    this.appConfig.app = this;
    this.appConfig.drawer = new DrawerImpl(() => this.refresh());
    AppSpinnerService.setDefaultOptions({
      spinner: this.appConfig.spinner
    });
    let refreshAfterWait = false;
    this.baseUrl = this.appConfig.url;
    let wait = 0;
    this.bindServiceInterceptors();
    this.appConfig.refresh = (complete = false) => {
      if (complete) {
        this.reload();
        return;
      }
      if (!wait) {
        RENDER_LOGGER.debug('refreshing the app...');
        wait = MIN_TIME_BETWEEN_REFRESH_CYCLES;
        refreshAfterWait = false;
        setTimeout(() => {
          this.forceUpdate();
          this.commonPartial?.forceUpdate();
          this.appConfig.currentPage?.forceUpdate();
          this.watcher.check();
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
    this.cleanup.push(
      NetworkService.notifier.subscribe('onNetworkStateChange', (networkState: NetworkState) => {
        this.networkStatus = {...networkState};
        this.refresh();
      }
    ));
  }

  subscribe(event: string, fn: Function) {
    return this.eventNotifier.subscribe(event, fn);
  }

  notify(event: string, ...args: any) {
    return this.eventNotifier.notify(event, args);
  }

  get activePage() {
    return this.appConfig.currentPage;
  }

  get Widgets() {
    return this.commonPartial?.Widgets;
  }

  async onBeforePageLeave(currentPage: string, nextPage: string){
    //method can be override by the user from studio;
    return true;
  }

  goToPage(pageName: string, params: any)  {
    return this.appConfig.currentPage?.goToPage(pageName, params);
  }

  goBack(pageName: string, params: any) {
    return this.appConfig.currentPage?.goBack(pageName, params);
  }

  openUrl(url: string, params?: any)  {
    return this.appConfig.currentPage?.openUrl(url, params);
  }

  onBeforeServiceCall(config: InternalAxiosRequestConfig) {
    //DO NOT WRITE CODE HERE:
    //This is a placeholder for the WaveMaker developer.
    return config;
  }

  isSkeletonEnabled() {
    return this.appConfig.spinner.loader == "skeleton";
  }

  onServiceSuccess(data: any, response: AxiosResponse) {
    //DO NOT WRITE CODE HERE:
    //This is a placeholder for the WaveMaker developer.
  }

  onServiceError(errorMsg: any, error: AxiosError<any>) {
    //DO NOT WRITE CODE HERE:
    //This is a placeholder for the WaveMaker developer.
  }

  invokeNativeApi(key: string, data: Object) {
    if (NativeModulesProxy.EmbedCommModule
        && (Platform.OS === 'android' || Platform.OS === 'ios')) {
        return NativeModulesProxy.EmbedCommModule.sendToNative(key, data || {});
    } else {
        return Promise.reject('Not able to invoke Native API in this platform.');
    }
  }

  triggerPageReady(activePageName: string, activePageScope: BasePage) {
    try {
      this.onPageReady(activePageName, activePageScope);
    } catch(e) {
      console.error(e);
    }
  }

  onPageReady(activePageName: string, activePageScope: BasePage) {

  }

  setTimezone(timezone: any){
    AppI18nService.setTimezone(timezone);
  }

  get spinner() {
    return AppSpinnerService;
  }

  openBrowser(url: string, params = {} as any) {
    if (url) {
      if (isWebPreviewMode()) {
        window.open(url, '_blank');
      } else if (url.startsWith('http') && params.target === '_blank') {
        WebBrowser.openBrowserAsync(url);
      } else {
        return Linking.openURL(url);
      }
    }
    return Promise.resolve();
  }

  // To support old api
  reload() {}

  bindServiceInterceptors() {
    this.axiosInterceptorIds = [
      axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
        const url = config.url as string;
        if (!(url.startsWith('http://') || url.startsWith("https://"))) {
          config.url = this.appConfig.url + '/' + url;
        }
        config.headers = config.headers || {};
        config.headers['X-Requested-With'] = 'XMLHttpRequest';
        console.log('onBeforeService call invoked on ' + config.url);
        this.notify('beforeServiceCall', config);
        return this.onBeforeServiceCall(config);
      }),
      axios.interceptors.response.use(
        (response: AxiosResponse) => {
          this.onServiceSuccess(response.data, response);
          this.notify('afterServiceCall', response.config, response);
          return response;
        },(error: AxiosError<any>) => {
          let errorDetails: any = error.response, errMsg;
          errorDetails = getValidJSON(errorDetails?.data) || errorDetails?.data;
          if (errorDetails && errorDetails.errors) {
              errMsg = parseErrors(errorDetails.errors) || "Service Call Failed";
          } else {
              errMsg = error.message || "Service Call Failed";
          }
          error.message = errMsg;
          console.error(`Error ${errMsg} recieved from ${error.response?.config?.url}`);
          this.onServiceError(error.message, error);
          if (error.response?.config.url?.startsWith(this.appConfig.url) && !error.response?.config.url?.includes('/services/') && error.response?.status === 401) {
            this.appConfig.currentPage?.pageName !== 'Login' && this.appConfig.currentPage?.goToPage('Login');
          }
          this.notify('afterServiceCall', error.config, error);
          return Promise.reject(error)
        })
    ];
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

  triggerStartUpVariables() {
    return Promise.all(this.startUpVariables.map(s => this.Variables[s] && this.Variables[s].invoke()))
    .catch(() => {});
  }

  componentDidMount() {
    AppSpinnerService.show({
      spinner: this.appConfig.spinner
    });
    this.cleanup.push(...Object.values(this.Variables).map((v: any) => {
      return v.subscribe(VariableEvents.BEFORE_INVOKE, () => {
        this.notify(VariableEvents.BEFORE_INVOKE, v);
      });
    }));
    this.cleanup.push(...Object.values(this.Variables).map((v: any) => {
      return v.subscribe(VariableEvents.AFTER_INVOKE, () => {
        this.notify(VariableEvents.AFTER_INVOKE, v);
      });
    }));
    this.startUpActions.map(a => this.Actions[a] && this.Actions[a].invoke());
    return this.triggerStartUpVariables()
    .then(() => {
      this.onAppVariablesReady();
      this.isStarted = true;
      this.forceUpdate();
    }, () => {});
  }

  componentWillUnmount(): void {
    this.axiosInterceptorIds.map(id => {
      axios.interceptors.request.eject(id);
    });
    this.cleanup.forEach(fn => fn());
  }

  refresh() {
    this.appConfig.refresh();
  }

  getProviders(content: React.ReactNode) {
    return (
      <NavigationServiceProvider value={this}>
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
    this.toastsOpened = AppToastService.toastsOpened.length;
    return <WmMemo watcher={this.watcher} render={(watch) => {
      watch(() => AppToastService.refreshCount);
      return (
        <>
          {AppToastService.toastsOpened.map((o, i) =>{
            return this.getProviders((
              <ThemeProvider value={this.appConfig.theme}>
                <View key={i} style={[{
                  position: 'absolute',
                  width: '100%',
                  bottom: 0,
                  elevation: o.elevationIndex,
                  zIndex: o.elevationIndex
                }, o.styles]}>
                  <TouchableOpacity onPress={() => o.onClick && o.onClick()}>
                    {o.content}
                    {o.text && <WmMessage name={"message"+ i} type={o.type} caption={o.text} hideclose={true}></WmMessage>}
                  </TouchableOpacity>
                </View>
              </ThemeProvider>
              )
          )})}
        </>);
    }}/>;
  }

  renderDialogs(): ReactNode {
    return <WmMemo watcher={this.watcher} render={(watch) => {
      watch(() => last(AppModalService.modalsOpened)?.content);
      this.modalsOpened = AppModalService.modalsOpened.length;
          AppModalService.animatedRefs.length = 0;
      return(
        <>
        {AppModalService.modalOptions.content &&
          AppModalService.modalsOpened.map((o, i) => {
            return (
              <View key={(o.name || '') + i}
                onStartShouldSetResponder={() => true}
                onResponderEnd={() => o.isModal && AppModalService.hideModal(o)}
                style={deepCopy(styles.appModal,
                  o.centered ? styles.centeredModal: null,
                  o.modalStyle,
                  { elevation: o.elevationIndex,
                    zIndex: o.elevationIndex })}>
                    <Animatedview entryanimation={o.animation || 'fadeIn'} delay={o.animationdelay}
                      ref={ref => {
                        this.animatedRef = ref;
                        AppModalService.animatedRefs[i] = ref;
                      }}
                      style={[styles.appModalContent, o.contentStyle]}>
                      <GestureHandlerRootView style={{width: '100%', alignItems: 'center'}}>
                        <View
                          onStartShouldSetResponder={evt => true}
                          onResponderEnd={(e) => e.stopPropagation()}
                          style={{width: '100%', alignItems: 'center'}}>
                            {this.getProviders(o.content)}
                        </View>
                      </GestureHandlerRootView>
                    </Animatedview>
              </View>
            )}
          )
        }
      </>);
    }}/>;
  }

  renderDisplayManager(): ReactNode {
    return <WmMemo watcher={this.watcher} render={(watch) => {
      watch(() => AppDisplayManagerService.displayOptions.content);
      return AppDisplayManagerService.displayOptions.content
        ? (
          <ThemeProvider value={this.appConfig.theme}>
            <View style={[styles.displayViewContainer, {
              elevation: this.toastsOpened + this.modalsOpened + 1,
              zIndex: this.toastsOpened + this.modalsOpened + 1
            }]}>
              {AppDisplayManagerService.displayOptions.content}
            </View>
          </ThemeProvider>) : null;
    }}/>
  }

  renderIconsViewSupportForWeb() {
    try {
      return (<style type="text/css">{`
        @font-face {
          font-family: 'MaterialCommunityIcons';
          src: url(${MaterialCommunityIconsFont}) format('truetype');
        }
      `}</style>);
    } catch (e) {
      console.log('require react-native-vector-icons could not be loaded.');
    }
    return null;
  }

  getSelectedLocale() {
    return this.appConfig.selectedLocale;
  }

  getDependency(serviceName: string): any {
    const service = get(SUPPORTED_SERVICES, serviceName);
    if (service) {
      return service;
    }
  }

  renderApp(commonPartial:React.ReactNode) {
    this.autoUpdateVariables.forEach(value => this.Variables[value]?.invokeOnParamChange());
    const statusBarCustomisation = this.appConfig?.preferences?.statusbarStyles;
    const isTranslucent = statusBarCustomisation?.translucent;
    const Wrapper = isTranslucent ? View : SafeAreaView;
    return (
      <SafeAreaProvider>
        <SafeAreaInsetsContext.Consumer>
          {(insets = {top: 0, bottom: 0, left: 0, right: 0})=>{
            this.statusbarInsets = insets;
            return <PaperProvider theme={this.paperTheme}>
            <React.Fragment>
            {Platform.OS === 'web' ? this.renderIconsViewSupportForWeb() : null}
              {this.getProviders(
                <Wrapper style={{ flex: 1 }}>
                  <StatusBar
                    backgroundColor={statusBarCustomisation?.backgroundColor}
                    translucent={isTranslucent}
                    barStyle={statusBarCustomisation?.barStyle || 'default'}
                  />
                  <ThemeProvider value={this.appConfig.theme}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.container}>
                      <GestureHandlerRootView style={styles.container}>
                      <AppNavigator
                        app={this}
                        landingPage={(this.props as any).pageName}
                        landingPageParams={(this.props as any)?.pageName && this.props}
                        hideDrawer={this.appConfig.drawer?.getContent() === null}
                        drawerContent={() => this.appConfig.drawer? this.getProviders(this.appConfig.drawer.getContent()) : null}
                        drawerAnimation={this.appConfig.drawer?.getAnimation()}></AppNavigator>
                        {commonPartial}
                      </GestureHandlerRootView>
                    </View>
                    {this.appConfig.url ?
                      (<WmNetworkInfoToaster  appLocale={this.appConfig.appLocale}></WmNetworkInfoToaster>)
                      : null}
                  {this.renderToasters()}
                  {this.renderDialogs()}
                  {this.renderDisplayManager()}
                  </View>
                  </ThemeProvider>
                </Wrapper>
              )}
            </React.Fragment>
          </PaperProvider>}
          }
        </SafeAreaInsetsContext.Consumer>
      </SafeAreaProvider>)
      
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
    flexDirection: 'column',
    justifyContent: 'center'
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
    justifyContent: 'center',
    width: '100%',
    left: 0,
    right: 0,
    top: 0,
    bottom:0
  } as ViewStyle
};
