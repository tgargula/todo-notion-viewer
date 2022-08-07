import { ReactNode } from "react";
import { useProvideStorage, storageContext } from "./useStorage";

type Props = {
  children: ReactNode;
}

export const StorageProvider = ({ children }: Props) => {
  const storage = useProvideStorage();
  return <storageContext.Provider value={storage}>{children}</storageContext.Provider>
}