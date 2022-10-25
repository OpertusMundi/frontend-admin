import { ClientContact } from 'model/chat';
import { PayOut } from 'model/order';

export const getContactFromPayOut = (row: PayOut): ClientContact | null => {
  if (row.provider) {
    const p = row.provider;
    return {
      id: p.key,
      logoImage: p.logoImage,
      logoImageMimeType: p.logoImageMimeType,
      name: p.name,
      email: p.email,
    };
  }

  return null;
};