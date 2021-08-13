import * as Contacts from 'expo-contacts';
import permissionManager from '@wavemaker/app-rn-runtime/runtime/services/device/permissions';
import { ContactsInput } from '@wavemaker/app-rn-runtime/core/device/contacts-service';
import { ContactsOutput, PhoneNumber} from "@wavemaker/app-rn-runtime/variables/device/contacts/get-contacts.operation";


export class ContactsService {

  constructor() {}

  public getContacts(params: ContactsInput): Promise<ContactsOutput> {
    return new Promise((resolve, reject) => {
      permissionManager.requestPermissions('contacts').then(() => {
        return Contacts.getContactsAsync({
          fields: [ Contacts.Fields.ID, Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
          name: params.contactFilter
        }).then((value: any) => {
          let contacts: any = [];
          value.data.forEach((c: any) => {
            const numbers = [] as Array<PhoneNumber>;
            c.phoneNumbers?.forEach((num: any) => {
              numbers.push({
                value: num.number as string
              });
            });
            contacts.push({
              id: c.id,
              displayName: c.name,
              phoneNumbers: numbers
            });
          });
          return resolve(contacts);
        });
      }, reject);
    });
  }
}
