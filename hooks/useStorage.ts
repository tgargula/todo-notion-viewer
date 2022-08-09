import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useState } from "react";
import { FetchAllResponse } from "../services/notion/types/response.type";

type StorageItemMetadata = {
  lastUpdatedAt: Date;
};

type StorageItem = {
  tasks: {
    data: FetchAllResponse;
  } & StorageItemMetadata;
};

type StorageKey = keyof StorageItem;

export const storageContext = createContext<{
  setItem: <T extends StorageKey>(
    key: T,
    data: StorageItem[T]["data"]
  ) => Promise<void>;
  getItem: <T extends StorageKey>(
    key: T
  ) => Promise<
    | {
        data: StorageItem[T]["data"];
        lastUpdatedAt: Date;
      }
    | undefined
  >;
}>({
  setItem: () => Promise.reject(),
  getItem: () => Promise.reject(),
});

const useStorage = () => {
  return useContext(storageContext);
};

export const useProvideStorage = () => {
  // Hotfix: Disables async storage
  AsyncStorage.clear();

  const [updates, setUpdates] = useState<Record<StorageKey, Date>>({
    tasks: new Date(),
  });

  const setItem = useCallback(
    async <T extends StorageKey>(key: T, data: StorageItem[T]["data"]) => {
      const item = {
        data,
        lastUpdatedAt: new Date().toUTCString(),
      };
      await AsyncStorage.setItem(key, JSON.stringify(item));
      setUpdates({ ...updates, [key]: new Date().toUTCString() });
    },
    []
  );

  const getItem = useCallback(
    async <T extends StorageKey>(
      key: T
    ): Promise<StorageItem[T] | undefined> => {
      const maybeItem = await AsyncStorage.getItem(key);
      if (!maybeItem) return undefined;

      // We assume that the types are correct
      const { data, lastUpdatedAt } = JSON.parse(maybeItem);

      return {
        data,
        lastUpdatedAt: new Date(lastUpdatedAt),
      };
    },
    [updates]
  );

  return { setItem, getItem };
};

export default useStorage;
