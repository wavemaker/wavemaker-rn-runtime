import React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

interface AppStackNavigatorProps {
  pages: any[];
  landingPage: string; 
}

const pages = {} as any;

class Screen extends React.Component {

  private cleanUp = [] as Function[];

  constructor(props: any) {
    super(props);
    this.state = {
      renew: false,
      page: this.createPage()
    };
    const navigation = (this.props as any).navigation as any;
    this.cleanUp.push(navigation.addListener('focus', () => {
      const state = (this.state as any);
      if (state.renew) {
        state.page = this.createPage();
        this.setState(() => ({
          renew: false,
          page: state.page
        }));
      }
    }));
  }

  private createPage() {
    const props = this.props as any;
    return React.createElement(pages[props.route.name].component, {...props, destroyMe: () => {
      setTimeout(() => {
        this.setState(() => ({renew: true, page: null}));
      }, 100);
    }});
  }

  componentWillUnmount() {
    this.cleanUp.forEach(fn => fn && fn());
  }

  render() {
    return (this.state as any).page || (<View/>);
  }
}

const getPageId = (pageName: string, pageParams: any) => {
  const pageParamsStr = pageParams ? Object.keys(pageParams)
    .sort()
    .map((k: string) => `${k}=${pageParams[k]}`)
    .join('&') : '';
  return `${pageName}?${pageParamsStr}`;
}

const AppStackNavigator = (props: AppStackNavigatorProps) => {
  return (<Stack.Navigator initialRouteName={props.landingPage}>
    {props.pages.map(p => {
      pages[p.name] = p;
      return (
        <Stack.Screen key={p.name}
          name={p.name}
          component={Screen}
          getId={({params}) => getPageId(p.name, params)}
          options={{
            headerShown: false
          }}
        />);
      })}
  </Stack.Navigator>);
};

export default AppStackNavigator;