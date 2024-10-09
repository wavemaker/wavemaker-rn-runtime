import React, { ReactNode } from 'react';
import { Platform, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { isWebPreviewMode } from '@wavemaker/app-rn-runtime/core/utils';
import AppConfig from '@wavemaker/app-rn-runtime/core/AppConfig';
import injector from '@wavemaker/app-rn-runtime/core/injector';
import AppDrawerNavigator from './navigator/drawer.navigator';
import AppStackNavigator from './navigator/stack.navigator';
import { isEmpty, keys, last } from 'lodash';
import ThemeVariables from '../styles/theme.variables';

declare const window: any;

export interface AppNavigatorProps {
  drawerContent: () => ReactNode;
  drawerAnimation: string;
  drawerWidth: number
  hideDrawer: boolean;
  landingPage?: string;
  landingPageParams?: any;
  app: any;
}

const getNavigationState = (pageName: string, params: any) => {
  return {
    routes: [{
      name: 'pages',
      state: {
        index: 0,
        routes: [{
          name: pageName,
          params: params
        }]
      }
    }]
  };
};

const getStateFromPath = (path: string, options?: any) => {
  let hash: string = window.location.hash;
  hash = hash.substring(1);
  if (hash && hash.startsWith('/')) {
    hash = hash.substring(1);
  }
  if (!hash) {
    return;
  }
  let [pageName, paramstr] = hash.split('?');
  let params = {} as any;
  if (paramstr) {
    paramstr.split('&').forEach((p) => {
      const [k, v] = p.split('=');
      params[k] = v;
    });
  }
  return getNavigationState(pageName, params);
};

const getPathFromState = (state: any, options: any) => {
  const pagesRoute = state?.routes[0];
  const pageRoute: any = last(pagesRoute?.state.routes);
  let path = '';
  if (pageRoute) {
    path = window.location.href.split('#')[0] + '#/'+ pageRoute.name;
    if (!isEmpty(pageRoute.params)) {
      path += '?' + keys(pageRoute.params).map((k) => {
        return `${k}=${pageRoute.params[k]}`
      }).join('&');
    }
  }
  setTimeout(() => {  
    const id = window.history.state?.id;
    window.history.replaceState({id}, null, path);
  });
  return path;
};

export const AppNavigator = (props: AppNavigatorProps) => {
  const appConfig = injector.get<AppConfig>('APP_CONFIG');
  const pages = {};
  const linking = {
    prefixes: [`${appConfig.appId}://`],
    config: {
      screens: {
        "pages": {
          path: "pages",
          screens: pages
        }
      }
    },
    getStateFromPath: isWebPreviewMode() ? getStateFromPath : undefined,
    getPathFromState: isWebPreviewMode()? getPathFromState: undefined
  } as any;

  const navigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: ThemeVariables.INSTANCE.pageContentBgColor
    },
  };
  
  appConfig.pages?.forEach((p) => {
    //@ts-ignore
    pages[p.name] = p.name;
  });
  const stack = (<AppStackNavigator
    pages={appConfig.pages || []}
    landingPage={appConfig.landingPage}></AppStackNavigator>);
  const leftNav = (<AppDrawerNavigator
      type={props.drawerAnimation === 'slide-over' ? 'front' : 'slide'}
      width={props.drawerWidth}
      hide={props.hideDrawer}
      content={() => (props.drawerContent && props.drawerContent())  || (<View/>)}
      rootComponent={stack}/>);
      const initialState = props.landingPage && Platform.OS !== 'web' ? 
        getNavigationState(props.landingPage, props.landingPageParams)
      : undefined;
  return (<NavigationContainer initialState={initialState} linking={linking} theme={navigationTheme}>{leftNav}</NavigationContainer>);
};
