import {
  addContact,
  getContactById,
  listContacts,
  removeContact,
  updateContactById,
} from '../services/contactsServices.js';
import HttpError from '../helpers/HttpError.js';
import { createContactSchema, updateContactSchema } from '../schemas/contactsSchemas.js';
import { ctrlWrapper } from '../helpers/ctrlWrapper.js';

export const getAllContacts = ctrlWrapper(async (req, res) => {
  const result = await listContacts();
  res.json(result);
});

export const getOneContact = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const result = await getContactById(id);
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
});

export const deleteContact = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const result = await removeContact(id);
  if (!result) {
    throw HttpError(404);
  }
  res.status(200).json(result);
});

export const createContact = ctrlWrapper(async (req, res) => {
  const { error } = createContactSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  const result = await addContact(req.body);
  res.status(201).json(result);
});

export const updateContact = ctrlWrapper(async (req, res) => {
  const { error } = updateContactSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  if (Object.keys(req.body).length === 0) {
    throw HttpError(400, 'Body must have at least one field');
  }
  const { id } = req.params;
  const result = await updateContactById(id, req.body);
  if (!result) {
    throw HttpError(404);
  }
  res.status(200).json(result);
});
