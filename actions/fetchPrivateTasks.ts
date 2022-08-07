import { Client } from "@notionhq/client";
import { PRIVATE_DATABASE_ID } from "@env";
import { TaskProps } from "../components/Task";

export const fetchPrivateTasks = async (
  notion: Client
): Promise<TaskProps[]> => {
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
    return response.results.map(({ properties, id }: any) => ({
      id,
      category: "personal",
      title: properties.Name.title
        .map(({ plain_text: text }: { plain_text: string }) => text)
        .join(""),
      status: properties.Status.select.name,
      deadline: properties.Deadline.date?.start,
    }));
  } catch (err: any) {
    console.error(err);
    throw err;
  }
};
