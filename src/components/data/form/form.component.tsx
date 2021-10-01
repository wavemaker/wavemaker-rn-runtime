import React from 'react';
import {Text, View} from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import { widgetsWithUndefinedValue } from '@wavemaker/app-rn-runtime/core/utils';
import {isArray, forEach, isEqual, isObject, get} from 'lodash';

import WmFormProps from './form.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmFormStyles } from './form.styles';
import {PERFORMANCE_LOGGER} from "@wavemaker/app-rn-runtime/core/logger";
import {VARIABLE_LOGGER} from "@wavemaker/app-rn-runtime/variables/base-variable";
import WmLabel from "@wavemaker/app-rn-runtime/components/basic/label/label.component";
import WmIcon from "@wavemaker/app-rn-runtime/components/basic/icon/icon.component";

export class WmFormState extends BaseComponentState<WmFormProps> {
  isValid = false;
}

export default class WmForm extends BaseComponent<WmFormProps, WmFormState, WmFormStyles> {
  private formWidgets: any;
  private formdataoutput: any;
  constructor(props: WmFormProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmFormProps());
  }

  processFormFields() {
    this.formWidgets = {};
    const traverse = (currentNode: any) => {
      if (currentNode.props?.formRef) {
        this.formWidgets[currentNode.props.name] = currentNode;
        if (this.state.props.formdata) {
          currentNode.props.onChange(null, currentNode, get(this.state.props.formdata, currentNode.props.formKey));
        }
      }
      if(currentNode.props?.children) {
        if(isArray(currentNode.props.children)) {
          for(let i = 0; i < currentNode.props.children.length; i++) {
            traverse(currentNode.props.children[i]);
          }
        } else {
          traverse(currentNode.props.children);
        }
      }
    }
    traverse(this);
  }

  componentDidMount() {
    this.processFormFields();
    super.componentDidMount();
  }

  submit() {
    this.handleSubmit();
  }

  // @ts-ignore
  handleSubmit(event?: any) {
    event?.preventDefault();
    const formData = this.state.props.dataoutput;
    let isValid = true;
    forEach(formData, (val, key) => {
      if(!val && this.formWidgets[key]?.props.required && widgetsWithUndefinedValue.indexOf(this.formWidgets[key]?.props.widget) < 0) {
        isValid = false;
      }
      this.formWidgets[key] && this.formWidgets[key].props.onValidate();
    });
    if(!isValid) {
      return false;
    }
    if(this.props.onBeforesubmit) {
      this.invokeEventCallback('onBeforesubmit', [ null, this.proxy, formData ]);
    }
    if (this.props.formSubmit) {
      this.props.formSubmit(formData, ((data: any) => {
        this.invokeEventCallback('onSubmit', [ null, this.proxy, formData ]);
        this.onResultCb(data, 'success');
      }), ((error: any) => {
        this.invokeEventCallback('onSubmit', [ null, this.proxy, formData ]);
        this.onResultCb(error, '');
      }));
    } else {
      this.invokeEventCallback('onSubmit', [ null, this.proxy, formData ]);
    }
  }

  onResultCb(response: any, status: string, event?: any) {
    this.invokeEventCallback('onResult', [ null, this.proxy, response ]);
    if (status) {
        this.invokeEventCallback('onSuccess', [ null, this.proxy, response ]);
    } else {
        this.invokeEventCallback('onError', [ null, this.proxy, response ]);
    }
  }

  updateDataOutput(key: string, val: any) {
    var current = this.formdataoutput || {};
    if(key.indexOf('.') > -1) {
      const obj = key.split('.');
      current[obj[0]] = isObject(current[obj[0]]) ? current[obj[0]] : {};
      current[obj[0]][obj[1]] = val;
    } else {
      current[key] = val;
    }
    this.formdataoutput = current;
    this.updateState({ props: { dataoutput: current }} as WmFormState);
  }

  onPropertyChange(name: string, $new: any, $old: any) {
    switch (name) {
      case 'formdata':
        if($new && this.formWidgets) {
          PERFORMANCE_LOGGER.debug(`form data for ${this.props.name} changed from ${JSON.stringify($old)} to ${JSON.stringify($new)}`);
          forEach(this.formWidgets, (widget) => {
            widget.props.onChange(null, widget, get($new, widget.props.formKey));
          });
        }
    }
  }

  renderWidget(props: WmFormProps) {
    return (
      <View style={this.styles.root}>
        <View style={this.styles.heading}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <WmIcon styles={this.styles.listIcon} iconclass={props.iconclass}></WmIcon>
            <View>
              <WmLabel styles={this.styles.title} caption={props.title}></WmLabel>
              <WmLabel styles={this.styles.subheading} caption={props.subheading}></WmLabel>
            </View>
          </View>
        </View>
        {props.children}
      </View>
    );
  }
}
