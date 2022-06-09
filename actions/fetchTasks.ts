import { TaskGroupProps } from "../components/TaskGroup";
import { fetchBengTasks } from "./fetchBengTasks";
import { fetchBitTasks } from "./fetchBitTasks";
import { fetchPrivateTasks } from "./fetchPrivateTasks";

export const fetchTasks = async (): Promise<TaskGroupProps[]> => {
  return Promise.all([
    { name: "Personal", data: await fetchPrivateTasks() },
    { name: "Scientific Group", data: await fetchBitTasks() },
    { name: "Engineering Thesis", data: await fetchBengTasks() },
  ]);
};
