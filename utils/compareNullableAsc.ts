import { compareAsc } from "date-fns"

export const compareNullableAsc = (a: Date | undefined, b: Date | undefined) => {
  if (!a && !b) return 0;
  if (!b) return -1;
  if (!a) return 1;

  return compareAsc(a, b);
}