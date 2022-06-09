import { Client } from "@notionhq/client";
import { BIT_DATABASE_ID, NOTION_USER_ID } from "@env";
import { TaskProps } from "../components/Task";

export const fetchBitTasks = async (notion: Client): Promise<TaskProps[]> => {
  try {
    const response = await notion.databases.query({
      database_id: BIT_DATABASE_ID,
      filter: {
        and: [
          {
            or: [
              {
                property: "Status",
                select: { equals: "To do" },
              },
              {
                property: "Status",
                select: { equals: "In progress" },
              },
            ],
          },
          {
            property: "PoC",
            people: { contains: NOTION_USER_ID },
          },
        ],
      },
    });
    return response.results.map(({ properties }: any) => ({
      title: properties.Task.title[0].plain_text,
      status: properties.Status.select.name,
      deadline: properties.Deadline.date?.start,
    }));
  } catch (err: any) {
    console.error(err);
    throw err;
  }
};
