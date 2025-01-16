import { clsx, type ClassValue } from "clsx";
import moment from "moment";
import { twMerge } from "tailwind-merge";
moment.locale("zh-cn");
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function formatDate(timeStamp: number) {
  return moment(timeStamp * 1000).format("YYYY/MM/DD");
}
export function formatDateTime(timeStamp: number) {
  return moment(timeStamp * 1000).format("LLLL");
}
