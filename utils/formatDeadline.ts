import {
  endOfDay,
  getHours,
  getMilliseconds,
  getMinutes,
  getSeconds,
} from "date-fns";

export const formatDeadline = <T extends Date | undefined>(date: T): T => {
  if (!date) {
    return undefined as T;
  }

  // The time was not given if equals 0, so the deadline should be set to the end of the day
  const deadline =
    getHours(date) === (-date.getTimezoneOffset() / 60) % 24 &&
    getMinutes(date) === 0 &&
    getSeconds(date) === 0 &&
    getMilliseconds(date) === 0
      ? endOfDay(date)
      : date;

  return deadline as T;
};
