import { config, statusOrder } from "./config";
import { NotionAbstractService } from "./notion.abstract.service";
import { Category } from "../../types/types";
import { FetchOneRequest, UpdateStatusRequest } from "./types/request.type";
import {
  FetchAllResponse,
  FetchManyResponse,
  FetchOneResponse,
  UpdateStatusResponse,
} from "./types/response.type";
import { compareNullableAsc } from "../../utils/compareNullableAsc";

export class NotionService extends NotionAbstractService {
  constructor() {
    super();
  }

  async fetchAllTasks(): Promise<FetchAllResponse> {
    const categories: Array<Category> = ["beng", "bit", "personal", "university"];
    return Promise.all(
      categories.map(async (category) => ({
        name: config[category].displayName,
        data: await this.fetchManyByCategory(category),
      }))
    );
  }

  async fetchManyByCategory(category: Category): Promise<FetchManyResponse> {
    const response = await this._fetchManyByOptions({
      ...config[category].general,
      ...config[category].fetchMany,
    });

    return response
      .sort((a, b) => compareNullableAsc(a.deadline, b.deadline))
      .sort((a, b) => statusOrder[b.status] - statusOrder[a.status]);
  }

  async fetchOneByCategory(
    req: FetchOneRequest,
    category: Category
  ): Promise<FetchOneResponse> {
    return this._fetchOneByOptions(req, {
      ...config[category].general,
      ...config[category].fetchOne,
    });
  }

  async updateStatus(req: UpdateStatusRequest, category: Category): Promise<UpdateStatusResponse> {
    return this._updateOneByOptions(req, { ...config[category].general });
  }
}
