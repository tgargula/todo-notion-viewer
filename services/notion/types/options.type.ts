import { Property } from ".";
import { Category, Status } from '../../../types/types';

interface PropertyNames extends Record<Property, string | null> {
  title: string;
  status: string;
  deadline: string;
  subject: string | null;
  tags: string | null;
  priority: string | null;
  cost: string | null;
  comments: string | null;
}

export type StatusType = 'status' | 'select';

type PropertyTypes = {
  status: StatusType;
}

export type GeneralOptions = {
  category: Category;
  databaseId: string;
  propertyNames: PropertyNames;
  propertyTypes: PropertyTypes;
};

export type FetchManyOptions = {
  personFilterName: string | null;
  status?: Array<Status>;
};

export type FetchOneOptions = {};

export type Options = {
  displayName: string;
  general: GeneralOptions;
  fetchMany: FetchManyOptions;
  fetchOne: FetchOneOptions;
};
