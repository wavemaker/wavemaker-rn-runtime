import { Input } from '@wavemaker/app-rn-runtime/variables/device/operation.provider';
import React from 'react';

export interface ContactsInput extends Input {
  contactFilter: string;
  contactsPluginService: any;
  permissionService: any;
}

export interface ContactsService {
  getContacts: (params: ContactsInput) => any;
}

// * expo-contacts plugin
export interface ContactsPluginService {
  Fields: any;
  getContactsAsync: any;
}
const ContactsPluginContext = React.createContext<ContactsPluginService>(null as any);

export const ContactsPluginProvider = ContactsPluginContext.Provider;
export const ContactsPluginConsumer = ContactsPluginContext.Consumer;
