import fs from 'fs/promises';
import { nanoid } from 'nanoid';
import path from 'path';

const contactsPath = path.resolve('db', 'contacts.json');

const updateContacts = contacts => fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

export async function listContacts() {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
}

export async function getContactById(contactId) {
  const allContacts = await listContacts();
  const contactById = allContacts.find(contact => contact.id === contactId);
  return contactById || null;
}

export async function removeContact(contactId) {
  const allContacts = await listContacts();
  const index = allContacts.findIndex(contact => contact.id === contactId);
  if (index === -1) {
    return null;
  }
  const [result] = allContacts.splice(index, 1);
  await updateContacts(allContacts);
  return result;
}

export async function addContact(data) {
  const allContacts = await listContacts();
  const newContact = { id: nanoid(), ...data };
  allContacts.push(newContact);
  await updateContacts(allContacts);
  return newContact;
}

export const updateContactById = async (id, data) => {
  const allContacts = await listContacts();
  const index = allContacts.findIndex(item => item.id === id);
  if (index === -1) {
    return null;
  }
  allContacts[index] = { ...allContacts[index], ...data };
  await updateContacts(allContacts);

  return allContacts[index];
};
