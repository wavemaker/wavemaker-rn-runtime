import { Output, Operation } from '../operation.provider';
import { ContactsInput, ContactsPluginService, ContactsService } from "@wavemaker/app-rn-runtime/core/device/contacts-service";
import { PermissionService } from "@wavemaker/app-rn-runtime/runtime/services/device/permission-service";

export interface PhoneNumber {
  value: string;
}

export interface ContactsOutput extends Output{
  id: number;
  displayName: string;
  phoneNumbers: Array<PhoneNumber>;
}

export class GetContactsOperation implements Operation {
  constructor(private contacts: ContactsService, private permissionService: PermissionService, private contactsPluginService: ContactsPluginService) {}

  public invoke(params: ContactsInput): any {
    return this.contacts.getContacts({ ...params, contactsPluginService: this.contactsPluginService, permissionService: this.permissionService });
  }
}
