import { Status } from "../../../types/types";

export type FetchOneRequest = {
  id: string;
};

export type UpdateStatusRequest = {
  taskId: string;
  status: Status;
};
