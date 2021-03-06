import { NOTION_KEY } from "@env";
import { Client } from "@notionhq/client";
import { TaskGroupProps } from "../components/TaskGroup";
import { fetchBengTasks } from "./fetchBengTasks";
import { fetchBitTasks } from "./fetchBitTasks";
import { fetchPrivateTasks } from "./fetchPrivateTasks";
import { fetchTaskDetails } from "./fetchTaskDetails";

const notion = new Client({ auth: NOTION_KEY });

export const fetchTasks = async (): Promise<TaskGroupProps[]> => {
  return Promise.all([
    { name: "Personal", data: await fetchPrivateTasks(notion) },
    { name: "Scientific Group", data: await fetchBitTasks(notion) },
    { name: "Engineering Thesis", data: await fetchBengTasks(notion) },
  ]);
};

export const fetchTask = async (id: string): Promise<{ url: string, deadline: any }> => {
  return fetchTaskDetails(notion, id);
}