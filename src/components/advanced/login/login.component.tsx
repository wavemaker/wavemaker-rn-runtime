import React from 'react';
import { Text, View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmLoginProps from './login.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmLoginStyles } from './login.styles';
import { SecurityConsumer, SecurityService } from '@wavemaker/app-rn-runtime/core/security.service';

export class WmLoginState extends BaseComponentState<WmLoginProps> {
  errorMsg = '';
}

export default class WmLogin extends BaseComponent<WmLoginProps, WmLoginState, WmLoginStyles> {
  securityService: SecurityService = null as any;
  constructor(props: WmLoginProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmLoginProps());
  }

  doLogin(formData: any) {
    if (this.props.eventsource) {
        this.props.eventsource.invoke({securityService: this.securityService, formData})
        .then((response: any) => {
        })
        .catch((error: any) => {
          this.updateState({errorMsg: error?.message} as WmLoginState);
        });
    } else {
        console.warn('Default action "loginAction" does not exist. Either create the Action or assign an event to onSubmit of the login widget');
    }
  }

  renderWidget(props: WmLoginProps) {
    return (<SecurityConsumer>
            {(securityService) => {
              this.securityService = securityService;
              return <View style={this.styles.root}>
                        {this.state.errorMsg && <Text style={{ color: 'white', fontSize: 14, backgroundColor: '#F44336', borderColor: '#f31e33', padding: 12 }}>{this.state.errorMsg}</Text>}
                        <View style={{padding: 35}}>{props.children}</View>
                      </View>;
            }}
            </SecurityConsumer>); 
  }
}
