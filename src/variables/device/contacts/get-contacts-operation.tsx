import { Input, Output, Operation } from '../operation.provider';
import * as Contacts from 'expo-contacts';

export interface ContactsInput extends Input {
  contactFilter: any;
}

export interface PhoneNumber {
  value: string;
}

export interface ContactOutput extends Output{
  id: number;
  displayName: string;
  phoneNumbers: Array<PhoneNumber>;
}
export class GetContactsOperation implements Operation {

  public invoke(params: ContactsInput): Promise<ContactOutput> {
    return Contacts.requestPermissionsAsync().then( response => {
      if (response.status !== 'granted') {
        return Promise.reject('Contacts access is not enabled in the app.');
      }

      return Contacts.getContactsAsync({
          fields: [Contacts.Fields.ID, Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
          name: params.contactFilter
        }).then(value => {
            let contacts: any = [];
             value.data.forEach(c => {
               const numbers = [] as Array<PhoneNumber>;
               c.phoneNumbers?.forEach((num) => {
                 numbers.push({
                      value: num.number as string
                 });
               })
               contacts.push({
                 id: c.id,
                 displayName: c.name,
                 phoneNumbers: numbers
                })
             });
          return Promise.resolve(contacts);
        })
    })
  }
}
