import React from 'react';
import { Output, Operation } from '../operation.provider';
import { ContactsInput, ContactsPluginConsumer, ContactsPluginService, ContactsService } from "@wavemaker/app-rn-runtime/core/device/contacts-service";
import { PermissionConsumer, PermissionService } from "@wavemaker/app-rn-runtime/runtime/services/device/permission-service";

export interface PhoneNumber {
  value: string;
}

export interface ContactsOutput extends Output{
  id: number;
  displayName: string;
  phoneNumbers: Array<PhoneNumber>;
}

export class GetContactsOperation implements Operation {
  constructor(private contacts: ContactsService) {}

  public invoke(params: ContactsInput): any {
    <PermissionConsumer>
      {(permissionService: PermissionService) => {
        return (
          <ContactsPluginConsumer>
            {(contactsPluginService: ContactsPluginService) => {
              return this.contacts.getContacts({ ...params, contactsPluginService, permissionService });
            }}
          </ContactsPluginConsumer>
        )
      }}
    </PermissionConsumer>
  }
}
