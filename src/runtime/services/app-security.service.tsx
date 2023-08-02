import { Platform } from 'react-native';
import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { each, includes } from 'lodash';

import networkService from '@wavemaker/app-rn-runtime/core/network.service';
import injector from '@wavemaker/app-rn-runtime/core/injector';
import AppConfig from '@wavemaker/app-rn-runtime/core/AppConfig';
import StorageService from '@wavemaker/app-rn-runtime/core/storage.service';
import { SecurityService } from '@wavemaker/app-rn-runtime/core/security.service';

import WebProcessService from './webprocess.service';

declare const window: any;

interface LoggedInUserConfig {
    isAuthenticated: Boolean;
    isSecurityEnabled: Boolean;
    roles: Array<string>;
    name: String;
    id: String;
    tenantId: String;
    userAttributes: any;
}

enum USER_ROLE {
    EVERYONE = 'Everyone',
    ANONYMOUS = 'Anonymous',
    AUTHENTICATED = 'Authenticated'
}

const authCookieStr = 'AUTH_COOKIE';
const XSRF_COOKIE_NAME = 'wm_xsrf_token';
const xsrf_header_name = 'X-WM-XSRF-TOKEN';

class AppSecurityService implements SecurityService {

    securityConfig: any;
    isLoggedIn = false;
    loggedInUser: any = {};
    token: any;
    appConfig: any;
    baseUrl: string = '';
    defaultSecurityConfig: any;

    constructor() {
      axios.interceptors.request.use((config: InternalAxiosRequestConfig) => this.onBeforeServiceCall(config));
    }

    onBeforeServiceCall(config: InternalAxiosRequestConfig) {
      if (!this.appConfig) {
        this.appConfig = this.getAppConfig();
        this.baseUrl = this.appConfig.url;
      }
      return this.getXsrfToken().then((token: string) => {
        if (config.url?.startsWith(this.baseUrl) && token) {
          if(config.headers) config.headers[xsrf_header_name] = token;
        }
        return config
      });
    }

    private getXsrfToken(): Promise<string> {
      if (this.token) {
        return Promise.resolve(this.token);
      }
      return StorageService.getItem(XSRF_COOKIE_NAME).then(xsrf_token => {
        this.token = xsrf_token;
        return this.token;
      });
    }

    private getAppConfig() {
      return injector.get<AppConfig>('APP_CONFIG');
    }

    public navigateToLandingPage(details: any) {
      this.appConfig.currentPage?.goToPage(details.userInfo?.landingPage || 'Main');
    }

    public appLogin(options: any) {
        // encode all parameters
        let payload = '';
        each(options.formData, function (value, name) {
            payload += (payload ? '&' : '') + encodeURIComponent(name) + '=' + encodeURIComponent(value);
        });
        axios.defaults.withCredentials = true;
        return axios.post(options.baseURL + '/j_spring_security_check', payload, {
            withCredentials: true,
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }}).then((response: AxiosResponse) => {
            const xsrfCookieValue = response.data ? response.data[XSRF_COOKIE_NAME] : '';
            this.token = xsrfCookieValue;
            StorageService.setItem(XSRF_COOKIE_NAME, xsrfCookieValue);
            this.isLoggedIn = true;
          }).then(() => this.load(options.baseURL))
          .then(() => this.getLoggedInUserDetails(options.baseURL, options.useDefaultSuccessHandler));
    }

    public load(baseURL: string) {
      return Promise.resolve().then(() => {
        if (networkService.isConnected()) {
          return axios.get(baseURL + '/services/security/info')
            .then((response: AxiosResponse) => response.data);
        }
        return this.appConfig.getServiceDefinitions(this.appConfig.url)
          .then(() => Promise.resolve(this.defaultSecurityConfig));
        }).then((details: any) => {
          const loggedInUser = {} as LoggedInUserConfig;
          this.securityConfig = details;
          const appConfig = this.appConfig;
          if (typeof details !== 'string' && (!details.securityEnabled || details.authenticated)) {
              if (details.authenticated) {
                  loggedInUser.isAuthenticated = details.authenticated;
                  loggedInUser.isSecurityEnabled = details.authenticated;
                  loggedInUser.roles           = details.userInfo.userRoles;
                  loggedInUser.name            = details.userInfo.userName;
                  loggedInUser.id              = details.userInfo.userId;
                  loggedInUser.tenantId        = details.userInfo.tenantId;
                  loggedInUser.userAttributes  = details.userInfo.userAttributes;
                  appConfig.loggedInUser = loggedInUser;
                  this.loggedInUser.dataSet = loggedInUser;
              }
              return appConfig.getServiceDefinitions(appConfig.url)
              .then(() => {
                return details;
              });
          } else {
            return appConfig.getServiceDefinitions(appConfig.url)
              .then(() => {
                this.redirectToLogin();
              });
          }
        });
    }

    private getLoggedInUserDetails(baseURL: string, useDefaultSuccessHandler: boolean = true) {
        if (!baseURL) {
            this.loggedInUser = {};
            return Promise.resolve({});
        }
        return this.load(baseURL);
    }

    
    public redirectToLogin() {
      if (this.securityConfig?.loginConfig?.type  === 'SSO') {
        const authUrl = this.appConfig.url  + '/services/security/ssologin';
        if (Platform.OS === 'web') {
          (window.parent || window).location.href = authUrl;
        } else {
          setTimeout(() => {
            WebProcessService.execute('LOGIN', '/services/security/ssologin', false, true)
            .then((output: any) => {
              if (output) {
                return JSON.parse(output.data && output.data.replace(/&quot;/g, "\""));
              }
              return Promise.reject();
            }).then((output: any) => {
              if (output[XSRF_COOKIE_NAME]) {
                this.token = output[XSRF_COOKIE_NAME];
                StorageService.setItem(XSRF_COOKIE_NAME, output[XSRF_COOKIE_NAME]);
              }
            }).then(() => {
              this.appConfig.refresh(true);
            }).then(() => this.load(this.baseUrl)).then(() => {
              return this.getLoggedInUserDetails(this.baseUrl);
            });
          }, 1000);
        }
      } else {
        const loginPage = this.securityConfig.loginConfig?.pageName || 'Login';
        injector.get<AppConfig>('APP_CONFIG').landingPage = loginPage;
        this.appConfig.currentPage?.goToPage(loginPage);
      }
      this.appConfig.refresh();
    }

    public appLogout(options: any) {
      return axios.post(options.baseURL + '/j_spring_security_logout', null, {
          withCredentials: true
      }).catch(() => {}).then(() => {
          this.isLoggedIn = false;
          this.redirectToLogin();
      });
    }

    private matchRoles(widgetRoles: Array<String>, userRoles: Array<String>) {
        return widgetRoles.some(function (item) {
            return includes(userRoles, item);
        });
    }

    public hasAccessToWidget(widgetRoles: String) {
        const widgetRolesArr = widgetRoles.split(',');
        // access the widget when 'Everyone' is chosen
        if (includes(widgetRolesArr, USER_ROLE.EVERYONE)) {
            return true;
        }

        // access the widget when 'Anonymous' is chosen and user is not authenticated
        if (includes(widgetRolesArr, USER_ROLE.ANONYMOUS) && !this.loggedInUser.dataSet?.isAuthenticated) {
            return true;
        }

        // access the widget when 'Only Authenticated Users' is chosen and user is authenticated
        if (includes(widgetRolesArr, USER_ROLE.AUTHENTICATED) && this.loggedInUser.dataSet?.isAuthenticated) {
            return true;
        }

        // access the widget when widget role and logged in user role matches
        return this.loggedInUser.dataSet?.isAuthenticated && this.matchRoles(widgetRolesArr, this.loggedInUser.dataSet?.roles);
    }
}

const appSecurityService = new AppSecurityService();

export default appSecurityService;
