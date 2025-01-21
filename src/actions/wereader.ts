"use server";

import { getReadingSummaryByYear } from "@/lib/wereader/wr-db";

export const readingSummaryAction = async (year: number) => {
  return await getReadingSummaryByYear(year);
};
