import { NOTION_KEY, NOTION_USER_ID } from "@env";
import { Client } from "@notionhq/client";
import { Status } from "../../types/types";
import {
  FetchManyOptions,
  FetchOneOptions,
  GeneralOptions,
  StatusType,
} from "./types/options.type";
import { FetchOneRequest, UpdateStatusRequest } from "./types/request.type";
import { FetchManyResponse, FetchOneResponse } from "./types/response.type";

let notionClient: Client | undefined;

export abstract class NotionAbstractService {
  readonly notion: Client;

  constructor() {
    notionClient = notionClient || new Client({ auth: NOTION_KEY });
    this.notion = notionClient;
  }

  _getStatusFilter(
    status: Array<Status>,
    statusType: StatusType,
    statusName: string
  ) {
    switch (statusType) {
      case "select":
        return {
          or: status.map((name) => ({
            property: statusName,
            select: { equals: name },
          })),
        };
      case "status":
        return {
          or: status.map((name) => ({
            property: statusName,
            status: { equals: name },
          })),
        };
    }
  }

  async _fetchManyByOptions({
    category,
    databaseId,
    propertyNames,
    propertyTypes,
    personFilterName,
    status = ["To do", "In progress"],
  }: GeneralOptions & FetchManyOptions): Promise<FetchManyResponse> {
    try {
      const statusFilter = this._getStatusFilter(
        status,
        propertyTypes.status,
        propertyNames.status
      );
      const filter = personFilterName
        ? {
            and: [
              statusFilter,
              {
                property: personFilterName,
                people: { contains: NOTION_USER_ID },
              },
            ],
          }
        : statusFilter;

      const response = await this.notion.databases.query({
        database_id: databaseId,
        filter,
      });
      return response.results.map(({ properties, id }: any) => {
        const deadline = properties[propertyNames.deadline].date;

        return {
          id,
          category,
          title: properties[propertyNames.title].title
            .map(({ plain_text: text }: { plain_text: string }) => text)
            .join(""),
          status: properties[propertyNames.status][propertyTypes.status]
            .name as Status,
          subject: propertyNames.subject
            ? properties[propertyNames.subject].select.name
            : undefined,
          deadline: deadline ? new Date(deadline.start) : undefined,
        };
      });
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  }

  async _fetchOneByOptions(
    { id }: FetchOneRequest,
    { category, propertyNames, propertyTypes }: GeneralOptions & FetchOneOptions
  ): Promise<FetchOneResponse> {
    try {
      const response: any = await this.notion.pages.retrieve({ page_id: id });

      const deadline = response.properties[propertyNames.deadline].date?.start;
      return {
        id,
        category,
        title: response.properties[propertyNames.title].title
          .map(({ plain_text: text }: { plain_text: string }) => text)
          .join(""),
        createdAt: new Date(response.created_time),
        updatedAt: new Date(response.last_edited_time),
        url: response.url,
        status:
          response.properties[propertyNames.status][propertyTypes.status].name,
        deadline: deadline && new Date(deadline),
        subject: propertyNames.subject
          ? response.properties[propertyNames.subject].select.name
          : undefined,

        tags: propertyNames.tags
          ? response.properties[propertyNames.tags].multi_select?.map(
              ({ name }: { name: string }) => name
            )
          : undefined,
        priority: propertyNames.priority
          ? response.properties[propertyNames.priority].select?.name
          : undefined,
        cost: propertyNames.cost
          ? response.properties[propertyNames.cost].select?.name
          : undefined,

        // TODO: Fill these fields conditionally
        comments: undefined,
        content: undefined,
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async _updateOneByOptions(
    { taskId, status }: UpdateStatusRequest,
    { propertyNames, propertyTypes }: GeneralOptions
  ) {
    const response = await this.notion.pages.update({
      page_id: taskId,
      properties: {
        [propertyNames.status]: {
          [propertyTypes.status]: {
            name: status,
          },
        } as any,
      },
    });

    return response;
  }
}
