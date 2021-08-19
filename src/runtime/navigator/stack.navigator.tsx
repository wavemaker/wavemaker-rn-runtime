import React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { SecurityConsumer } from '@wavemaker/app-rn-runtime/core/security.service';

const Stack = createStackNavigator();

interface AppStackNavigatorProps {
  pages: any[];
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
    return React.createElement(pages[props.route.params.pageName].component, {...props, destroyMe: () => {
      setTimeout(() => {
        this.setState(() => ({renew: true, page: null}));
      }, 100);
    }})
  }

  render() {
    return (this.state as any).page || (<View/>);
  }
}

const AppStackNavigator = (props: AppStackNavigatorProps) => {
  return (<SecurityConsumer>
    {(securityService) => {
      console.log("isLoggedInvalue>>>>>>>>>>", securityService.isLoggedIn);
      return <Stack.Navigator initialRouteName="Main">
      {props.pages.map(p => {
        if (p.securityNeeded && securityService && !securityService.isLoggedIn) {
          return;
        }
        pages[p.name] = p;
        return (
          <Stack.Screen key={p.name}
            name={p.name}
            initialParams={{
              pageName: p.name
            }}
            component={Screen}
            options={{
              headerShown: false,
            }}
          />);
        })}
    </Stack.Navigator>
    }}
    </SecurityConsumer>);
};

export default AppStackNavigator;