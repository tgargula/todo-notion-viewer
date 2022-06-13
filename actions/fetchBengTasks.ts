import { Client } from "@notionhq/client";
import { BENG_DATABASE_ID, NOTION_USER_ID } from "@env";
import { TaskProps } from "../components/Task";

export const fetchBengTasks = async (notion: Client): Promise<TaskProps[]> => {
  try {
    const response = await notion.databases.query({
      database_id: BENG_DATABASE_ID,
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
            property: "Assign",
            people: { contains: NOTION_USER_ID },
          },
        ],
      },
    });
    return response.results.map(({ properties, id }: any) => ({
      id,
      category: 'beng',
      title: properties.Name.title[0].plain_text,
      status: properties.Status.select.name,
      deadline: properties.Deadline.date?.start,
    }));
  } catch (err: any) {
    console.error(err);
    throw err;
  }
};
