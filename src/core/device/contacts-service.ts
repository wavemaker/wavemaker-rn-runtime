import { Input } from '@wavemaker/app-rn-runtime/variables/device/operation.provider';

export interface ContactsInput extends Input {
  contactFilter: string;
}

export interface ContactsService {
  getContacts: (params: ContactsInput) => any;
}
