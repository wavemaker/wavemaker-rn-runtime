import injector from '@wavemaker/app-rn-runtime/core/injector';
import AppConfig from '@wavemaker/app-rn-runtime/core/AppConfig';
import { SecurityOptions, SecurityService } from '@wavemaker/app-rn-runtime/core/security.service';
import axios, { AxiosResponse } from 'axios';
import { each } from "lodash";
declare const localStorage: any, window: any;

interface LoggedInUserConfig {
    isAuthenticated: Boolean;
    isSecurityEnabled: Boolean;
    roles: Array<string>;
    name: String;
    id: String;
    tenantId: String;
    userAttributes: any;
}

class AppSecurityService implements SecurityService {

    isLoggedIn = false;
    loggedInUser: any = {};
    token: any;
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
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'XMLHttpRequest'
        }}).then((response: AxiosResponse) => {
            const xsrfCookieValue = response.data ? response.data['wm_xsrf_token'] : '';
            this.token = xsrfCookieValue;
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('wm_xsrf_token', xsrfCookieValue);
            }
            this.isLoggedIn = true;
            this.getLoggedInUserDetails(options.baseURL);
        });
    }

    private getLoggedInUserDetails(baseURL: string) {
        return axios.get(baseURL + '/services/security/info').then((response: AxiosResponse) => {
            const loggedInUser = {} as LoggedInUserConfig;
            const details = response.data;
            const appConfig = injector.get<AppConfig>('APP_CONFIG');
            if (!details.securityEnabled || details.authenticated) {
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
                .then(() => details.authenticated && appConfig.currentPage?.goToPage(details.userInfo?.landingPage || 'Main'));
            } else {
                const myPromise = new Promise((resolve, reject) => {
                    setTimeout(() => {
                        injector.get<AppConfig>('APP_CONFIG').landingPage = 'Login';
                        appConfig.refresh();
                        resolve('true');
                    }, 300);
                  });
                return myPromise;
            }
            
        });
    }

    public appLogout(options: any) {
        return axios.post(options.baseURL + '/j_spring_security_logout', null, {
            withCredentials: true,
            headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-WM-XSRF-TOKEN': typeof localStorage !== 'undefined' ? localStorage.getItem('wm_xsrf_token') : this.token
            }
        }).then((response) => {
            this.isLoggedIn = false;
            const appConfig = injector.get<AppConfig>('APP_CONFIG');
            appConfig.currentPage?.goToPage('Login');
        });
    }

}

const appSecurityService = new AppSecurityService();

export default appSecurityService;