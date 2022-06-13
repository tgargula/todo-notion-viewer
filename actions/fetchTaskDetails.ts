import { Client } from "@notionhq/client";

export const fetchTaskDetails = async (notion: Client, id: string) => {
  try {
    const response: any = await notion.pages.retrieve({ page_id: id });

    return {
      deadline: response.properties.Deadline.date?.start,
      url: response.url,
      status: response.properties.Status.select.name,
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};
