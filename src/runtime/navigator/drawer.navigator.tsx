import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
const Drawer = createDrawerNavigator();

interface AppDrawerNavigatorProps {
  content: any;
  type: any;
  rootComponent: React.ReactNode;
}

class AppDrawerNavigator extends React.Component<AppDrawerNavigatorProps, any, any> {

  constructor(props: AppDrawerNavigatorProps) {
    super(props);
  }

  render(){
    return (<Drawer.Navigator 
      drawerContent={(_props) => this.props.content} 
      drawerType={this.props.type} >
      <Drawer.Screen name="leftDrawer">
        {(_props) => this.props.rootComponent}
      </Drawer.Screen>
    </Drawer.Navigator>);
  }
}

export default AppDrawerNavigator;