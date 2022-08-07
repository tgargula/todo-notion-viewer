import { BENG_DATABASE_ID, BIT_DATABASE_ID, PRIVATE_DATABASE_ID } from "@env";
import { Category, Status } from "../../types/types";
import { Options } from "./types/options.type";

export const config: Record<Category, Options> = {
  beng: {
    displayName: "Engineering thesis",
    general: {
      category: "beng",
      databaseId: BENG_DATABASE_ID,
      propertyNames: {
        title: "Name",
        status: "Status",
        deadline: "Deadline",
        tags: "Tags",
        priority: "Priority",
        cost: "Cost",
        comments: null,
      },
    },
    fetchOne: {},
    fetchMany: {
      personFilterName: "Assign",
    },
  },
  bit: {
    displayName: "Scientific group",
    general: {
      category: "bit",
      databaseId: BIT_DATABASE_ID,
      propertyNames: {
        title: "Task",
        status: "Status",
        deadline: "Deadline",
        tags: null,
        priority: null,
        cost: null,
        comments: "Comments",
      },
    },
    fetchOne: {},
    fetchMany: {
      personFilterName: "PoC",
    },
  },
  personal: {
    displayName: "Personal",
    general: {
      category: "personal",
      databaseId: PRIVATE_DATABASE_ID,
      propertyNames: {
        title: "Name",
        status: "Status",
        deadline: "Deadline",
        tags: null,
        priority: null,
        cost: null,
        comments: null,
      },
    },
    fetchOne: {},
    fetchMany: {
      personFilterName: null,
    },
  },
};

export const statusOrder: Record<Status, number> = {
  Backlog: 0,
  "To do": 1,
  "In progress": 2,
};
