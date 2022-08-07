import { Category, Status } from "../../../types/types";

export type FetchAllResponse = Array<{
  name: string;
  data: FetchManyResponse;
}>;

export type FetchManyResponse = Array<{
  id: string;
  category: Category;
  title: string;
  status: Status;
  deadline: Date | undefined;
}>;

export type FetchOneResponse = {
  id: string;
  url: string;
  category: Category;
  title: string;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
  deadline: Date | undefined;
  tags: Array<string> | undefined;
  priority: string | undefined;
  cost: string | undefined;
  comments: string | undefined;
  content: string | undefined;
};

export type UpdateStatusResponse = unknown;