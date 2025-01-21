import { ContactsInput } from '@wavemaker/app-rn-runtime/core/device/contacts-service';
import { ContactsOutput, PhoneNumber} from "@wavemaker/app-rn-runtime/variables/device/contacts/get-contacts.operation";

export class ContactsService {

  constructor() {}

  public getContacts(params: ContactsInput): Promise<Array<ContactsOutput>> {
    return new Promise((resolve, reject) => {
      const Fields = params?.contactsPluginService?.Fields;

      params?.permissionService?.requestPermissions && params.permissionService.requestPermissions('contacts').then(() => {
        return params.contactsPluginService?.getContactsAsync({
          fields: [Fields.ID, Fields.Name, Fields.PhoneNumbers],
          name: params.contactFilter
        }).then((value: any) => {
          let contacts: any = [];
          value.data.forEach((c: any) => {
            const numbers = [] as Array<any>;
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
      }, () => resolve([]));
      });
  }
}
