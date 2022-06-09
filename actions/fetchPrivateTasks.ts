import { Client } from "@notionhq/client";
import { NOTION_KEY, PRIVATE_DATABASE_ID } from "@env";
import { TaskProps } from "../components/Task";

const notion = new Client({ auth: NOTION_KEY });

export const fetchPrivateTasks = async (): Promise<TaskProps[]> => {
  try {
    const response = await notion.databases.query({
      database_id: PRIVATE_DATABASE_ID,
      filter: {
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
    });
    return response.results.map(({ properties }: any) => ({
      title: properties.Name.title[0].plain_text,
      status: properties.Status.select.name,
      deadline: properties.Deadline.date?.start,
    }));
  } catch (err: any) {
    console.error(err);
    throw err;
  }
};
