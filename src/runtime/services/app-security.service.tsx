import injector from '@wavemaker/app-rn-runtime/core/injector';
import AppConfig from '@wavemaker/app-rn-runtime/core/AppConfig';
import { SecurityOptions, SecurityService } from '@wavemaker/app-rn-runtime/core/security.service';
import axios from 'axios';
import { each } from "lodash";
import { config } from 'yargs';
declare const localStorage: any, window: any;

class AppSecurityService implements SecurityService {

    isLoggedIn = false;
    loggedInUser: any;
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
        }}).then((response) => {
            const xsrfCookieValue = response.data ? response.data['wm_xsrf_token'] : '';
            this.isLoggedIn = true;
            this.getLoggedInUserDetails(options.baseURL);
        }).then(() => {
            console.log("inner then");
        } , (error) => {
            console.log("inner error", error);
        });
    }

    private getLoggedInUserDetails(baseURL: string) {
        return axios.get(baseURL + '/services/security/info').then((response: any) => {
            const loggedInUser = {} as any;
            const details = response.data;
            const appConfig = injector.get<AppConfig>('APP_CONFIG');
            if (!details.securityEnabled || details.authenticated) {
                if (details.authenticated) {
                    loggedInUser.isAuthenticated = details.authenticated;
                    loggedInUser.roles           = details.userInfo.userRoles;
                    loggedInUser.name            = details.userInfo.userName;
                    loggedInUser.id              = details.userInfo.userId;
                    loggedInUser.tenantId        = details.userInfo.tenantId;
                    loggedInUser.userAttributes  = details.userInfo.userAttributes;
                    this.loggedInUser.dataSet = loggedInUser;   
                }
                return appConfig.getServiceDefinitions(appConfig.url)
                .then(() => details.authenticated && appConfig.currentPage?.goToPage(details.userInfo?.landingPage || 'Main'));
            } else {
                const myPromise = new Promise((resolve, reject) => {
                    setTimeout(() => {
                        console.info("navigate me", appConfig);
                        appConfig.currentPage?.goToPage('Login');
                    }, 300);
                  });
                return myPromise;
            }
            
        });
    }

    public appLogout(options: any, successCallback: any, failureCallback: any) {
        return axios.post(options.baseURL + '/j_spring_security_logout', null, {withCredentials: false}).then((response) => {
            this.isLoggedIn = false;
            const appConfig = injector.get<AppConfig>('APP_CONFIG');
            appConfig.currentPage?.goToPage('Login');
        }).then(() => {
            console.log("inner then");
        } , (error) => {
            console.log("inner error", error);
        });
    }

}

const appSecurityService = new AppSecurityService();

export default appSecurityService;