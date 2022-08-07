import { Property } from ".";
import { Category } from '../../../types/types';

interface PropertyNames extends Record<Property, string | null> {
  title: string;
  status: string;
  deadline: string;
  tags: string | null;
  priority: string | null;
  cost: string | null;
  comments: string | null;
}

export type GeneralOptions = {
  category: Category;
  databaseId: string;
  propertyNames: PropertyNames;
};

export type FetchManyOptions = {
  personFilterName: string | null;
  status?: Array<string>;
};

export type FetchOneOptions = {};

export type Options = {
  displayName: string;
  general: GeneralOptions;
  fetchMany: FetchManyOptions;
  fetchOne: FetchOneOptions;
};
