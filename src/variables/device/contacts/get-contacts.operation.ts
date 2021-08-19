import { Output, Operation } from '../operation.provider';
import { ContactsInput, ContactsService } from "@wavemaker/app-rn-runtime/core/device/contacts-service";

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

  public invoke(params: ContactsInput): Promise<ContactsOutput> {
    return this.contacts.getContacts(params);
  }
}
