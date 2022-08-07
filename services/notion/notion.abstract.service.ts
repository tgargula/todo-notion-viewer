import { NOTION_KEY, NOTION_USER_ID } from "@env";
import { Client } from "@notionhq/client";
import { Status } from "../../types/types";
import {
  FetchManyOptions,
  FetchOneOptions,
  GeneralOptions,
} from "./types/options.type";
import { FetchOneRequest } from "./types/request.type";
import { FetchManyResponse, FetchOneResponse } from "./types/response.type";

let notionClient: Client | undefined;

export abstract class NotionAbstractService {
  readonly notion: Client;

  constructor() {
    notionClient = notionClient || new Client({ auth: NOTION_KEY });
    this.notion = notionClient;
  }

  async _fetchManyByOptions({
    category,
    databaseId,
    propertyNames,
    personFilterName,
    status = ["Backlog", "To do", "In progress"],
  }: GeneralOptions & FetchManyOptions): Promise<FetchManyResponse> {
    try {
      const statusFilter = {
        or: status.map((name) => ({
          property: propertyNames.status,
          select: { equals: name },
        })),
      };
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
          status: properties[propertyNames.status].select.name as Status,
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
    { category, propertyNames }: GeneralOptions & FetchOneOptions
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
        status: response.properties[propertyNames.status].select.name,
        deadline: deadline && new Date(deadline),

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
}
