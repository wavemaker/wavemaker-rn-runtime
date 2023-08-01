import axios from 'axios';
import { clone, isEqual, noop } from 'lodash-es';
import * as Network from 'expo-network';
import NetInfo from '@react-native-community/netinfo';

import AppConfig from './AppConfig';
import StorageService from './storage.service';
import EventNotifier from './event-notifier';
import { getAbortableDefer, isWebPreviewMode, retryIfFails } from './utils';

export class NetworkState {
    isConnecting = false;
    isConnected = true;
    isNetworkAvailable = true;
    isServiceAvailable = true;
    noServiceRequired = false;
}

const AUTO_CONNECT_KEY = 'WM.NetworkService._autoConnect',
    IS_CONNECTED_KEY = 'WM.NetworkService.isConnected',
    excludedList = [new RegExp('/wmProperties.js')],
    networkState = new NetworkState();

/**
 * If server is not connected and url does not match the unblock list of regular expressions,
 * then this function return true. Otherwise, return false.
 * @param url
 * @returns {boolean}
 */
const blockUrl = (url: string) => {
    return !networkState.isConnected
        && url.startsWith('http')
        && excludedList.findIndex(regExp => regExp.test(url)) < 0;
};

axios.interceptors.request.use((request) => {
    if (!networkState.noServiceRequired && request.url && blockUrl(request.url)) {
        const url = request.url;
        const urlSplits = url.split('://');
        const pathIndex = urlSplits[1].indexOf('/');
        urlSplits[1] = 'localhost' + (pathIndex > 0 ? urlSplits[1].substr(pathIndex) : '/');
        request.url = urlSplits.join('://');
    }
    return request;
});

class NetworkService {
    static readonly SERVICE_NAME = 'NetworkService';

    private _autoConnect = true;
    private _lastKnownNetworkState: any;
    private _isCheckingServer = false;
    private appConfig: AppConfig = null as any;
    public readonly notifier: EventNotifier = new EventNotifier();

    constructor() {}

    /**
     * This method attempts to connect app to the server and returns a promise that will be resolved with
     * a boolean value based on the operation result.
     *
     * @returns {object} promise
     */
    public connect(silent = false): Promise<boolean> {
        this.setAutoConnect(true);
        return this.tryToConnect(silent);
    }

    /**
     * When the auto connect is enabled, then app is automatically connected  whenever server is available.
     * Every time when app goes offline, auto connect is enabled. Before app coming to online, one can disable
     * the auto connection flow using this method.
     */
    public disableAutoConnect = () => this.setAutoConnect(false);

    /**
     * This method disconnects the app from the server and returns a promise that will be resolved with
     * a boolean value based on the operation result. Use connect method to reconnect.
     *
     * @returns {object} promise
     */
    public disconnect(): Promise<boolean> {
        const p = this.tryToDisconnect();
        this.disableAutoConnect();
        return p;
    }

    /**
     * If pingServer is true, then it returns a promise that will be resolved with boolean based on service availability
     * check.If pingServer is false, returns a boolean value based on the last known service availability.
     *
     * @returns {boolean} if pingServer is true, then a promise is returned. Otherwise, a boolean value.
     */
    public isAvailable(pingServer = false): boolean | Promise<boolean> {
        if (pingServer) {
            return this.isServiceAvailable().then(() => {
                this.checkForNetworkStateChange();
                return networkState.isServiceAvailable;
            });
        }
        return networkState.isServiceAvailable;
    }

    /**
     * Returns true, if app is connected to server. Otherwise, returns false.
     *
     * @returns {boolean} Returns true, if app is connected to server. Otherwise, returns false.
     */
    public isConnected = () => {
        this.checkForNetworkStateChange();
        return networkState.isConnected;
    }

    /**
     * Returns true if app is trying to connect to server. Otherwise, returns false.
     *
     * @returns {boolean} Returns true if app is trying to connect to server. Otherwise, returns false.
     */
    public isConnecting = () => networkState.isConnecting;

    /**
     * This method returns a promise that is resolved when connection is established with server.
     *
     * @returns {object} promise a promise that is resolved with the returned object of fn
     */
    public onConnect() {
        let defer = getAbortableDefer(),
            cancelSubscription: Function;
        if (this.isConnected()) {
            return Promise.resolve();
        }
        cancelSubscription = this.notifier.subscribe('onNetworkStateChange', () => {
            if (this.isConnected()) {
                defer.resolve(true);
                cancelSubscription();
            }
        });
        defer.promise.catch(function () {
            cancelSubscription();
        });
        return defer.promise;
    }

    /**
     * This is a util method. If fn cannot execute successfully and network lost connection, then the fn will
     * be invoked when network is back. The returned can also be aborted.
     *
     * @param {function()} fn method to invoke.
     * @returns {object} promise a promise that is resolved with the returned object of fn
     */
    public retryIfNetworkFails(fn: Function) {
        const defer = getAbortableDefer();
        retryIfFails(fn, 0, 0, () => {
            let onConnectPromise: any;
            if (!this.isConnected()) {
                onConnectPromise = this.onConnect();
                defer.promise.catch(function () {
                    onConnectPromise.abort();
                });
                return onConnectPromise;
            }
            return false;
        }).then(defer.resolve, defer.reject);
        return defer.promise;
    }

    public async start(appConfig: AppConfig): Promise<any> {
        this.appConfig = appConfig;
        networkState.noServiceRequired = !appConfig.url;
        networkState.isConnected = (await StorageService.getItem(IS_CONNECTED_KEY)) === 'true';
        this._autoConnect = (await StorageService.getItem(AUTO_CONNECT_KEY)) !== 'false';
        const state = await Network.getNetworkStateAsync();
        networkState.isNetworkAvailable = !!state.isConnected;
        networkState.isConnected = networkState.isNetworkAvailable && networkState.isConnected;
        !isWebPreviewMode() && NetInfo.addEventListener(state => {
            if (state.isConnected !== networkState.isConnected) {
                if (state.isConnected) {
                    networkState.isNetworkAvailable = !!state.isConnected;
                    this.tryToConnect().catch(noop);
                } else {
                    networkState.isNetworkAvailable = false;
                    networkState.isServiceAvailable = false;
                    networkState.isConnected = false;
                    this.tryToDisconnect();
                }
            }
        });
        this.notifier.subscribe('onNetworkStateChange', (data: NetworkState) => {
            /**
             * If network is available and server is not available,then
             * try to connect when server is available.
             */
            if (data.isNetworkAvailable && !data.isServiceAvailable && !this._isCheckingServer && !data.noServiceRequired) {
                this._isCheckingServer = true;
                this.checkForServiceAvailiblity().then(() => {
                    this._isCheckingServer = false;
                    this.connect();
                }, () => {
                    this._isCheckingServer = false;
                });
            }
        });
        // to set the default n/w connection values.
        return this.tryToConnect(true).catch(noop);
    }

    public getServiceName() {
        return NetworkService.SERVICE_NAME;
    }

    /**
     * This function adds the given regular expression to the unblockList. Even app is in offline mode,
     * the urls matching with the given regular expression are not blocked by NetworkService.
     *
     * @param {string} urlRegex regular expression
     */
    public unblock(urlRegex: string) {
        excludedList.push(new RegExp(urlRegex));
    }

    public getState() {
        return clone(networkState);
    }

    private checkForNetworkStateChange() {
        if (!isEqual(this._lastKnownNetworkState, networkState)) {
            this._lastKnownNetworkState = clone(networkState);
            this.notifier.notify('onNetworkStateChange', [this._lastKnownNetworkState]);
        }
    }

    /**
     * Returns a promise that is resolved when server is available.
     * @returns {*}
     */
    private checkForServiceAvailiblity(): Promise<void> {
        const maxTimeout = 4500;
        return new Promise<void>(resolve => {
            const intervalId = setInterval(() => {
                if (networkState.isNetworkAvailable) {
                    this.isServiceAvailable(maxTimeout).then(available => {
                        if (available) {
                            clearInterval(intervalId);
                            resolve();
                        }
                    });
                }
            }, 5000);
        });
    }

    /**
     * Pings server to check whether server is available. Based on ping response network state is modified.
     * @returns {*} a promise that resolved with true, if server responds with valid status.
     * Otherwise, the promise is resolved with false.
     */
    private isServiceAvailable(maxTimeout?: number): Promise<boolean> {
        if (networkState.noServiceRequired) {
            networkState.isServiceAvailable = false;
            networkState.noServiceRequired = true;
            return Promise.resolve(false);
        }
        return this.pingServer(maxTimeout).then(response => {
            networkState.isServiceAvailable = response;
            if (!networkState.isServiceAvailable) {
                networkState.isConnecting = false;
                networkState.isConnected = false;
            }
            return response;
        });
    }

    /**
     * Pings server
     * @returns {*} a promise that resolved with true, if server responds with valid status.
     * Otherwise, the promise is resolved with false.
     * default timeout value is 1min.
     */
    private pingServer(maxTimeout = 60000): Promise<boolean> {
        let baseURL = this.appConfig.url;
        if (baseURL && !baseURL.endsWith('/')) {
            baseURL += '/';
        } else {
            baseURL = baseURL || '';
        }
        return axios.get(baseURL + 'services/application/wmProperties.js?t=' + Date.now(), {
            responseType: 'text',
            timeout: maxTimeout
        }).then((res) => res.status === 200, () => false);
    }

    private setAutoConnect(flag: boolean): void {
        this._autoConnect = flag;
        StorageService.setItem(AUTO_CONNECT_KEY, '' + flag);
    }

    /**
     * Tries to connect to remote server. Network State will be changed based on the success of connection
     * operation and emits an event notifying the network state change.
     *
     * @param silentMode {boolean} if true and connection is successful, then no event is emitted. Otherwise,
     * events are emitted for network status change.
     * @returns {*} a promise
     */
    private tryToConnect(silentMode = false): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.isServiceAvailable(5000).then(() => {
                if (networkState.isServiceAvailable && this._autoConnect) {
                    networkState.isConnecting = true;
                    if (!silentMode) {
                        this.checkForNetworkStateChange();
                    }
                    setTimeout(() => {
                        networkState.isConnecting = false;
                        networkState.isConnected = true;
                        StorageService.setItem(IS_CONNECTED_KEY, '' + true);
                        if (!silentMode) {
                            this.checkForNetworkStateChange();
                        }
                        resolve(true);
                    }, silentMode ? 0 : 5000);
                } else {
                    networkState.isConnecting = false;
                    networkState.isConnected = false;
                    StorageService.setItem(IS_CONNECTED_KEY, '' + false);
                    reject();
                    this.checkForNetworkStateChange();
                }
            });
        });
    }

    private tryToDisconnect(): Promise<boolean> {
        networkState.isConnected = false;
        networkState.isConnecting = false;
        this.checkForNetworkStateChange();
        StorageService.setItem(IS_CONNECTED_KEY, '' + networkState.isConnected);
        return Promise.resolve(networkState.isConnected);
    }
}

export default new NetworkService();