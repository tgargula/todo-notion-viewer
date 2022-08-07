export type RootStackParamList = {
  Home: undefined;
  TaskDetails: { id: string, title: string, category: string };
};

export type Status = "Backlog" | "To do" | "In progress";

export type Category = "personal" | "bit" | "beng";
