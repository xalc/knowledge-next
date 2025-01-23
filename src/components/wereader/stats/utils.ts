import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");
export const getDayofYear = (year: number) => (moment(String(year)).isLeapYear() ? 366 : 365);
export const getWeeksOfYear = (year: number) => {
  const startDate = moment(String(year)).startOf("year");
  const dayOfyear = getDayofYear(year);
  const weeks = [];
  let currentWeek = [];
  let currentDate = startDate;
  const firstDayOfWeek = currentDate.day();
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push(null);
  }
  for (let i = 0; i < dayOfyear; i++) {
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(currentDate);
    currentDate = moment(currentDate).add(1, "days");
  }
  while (currentWeek.length < 7) {
    currentWeek.push(null);
  }
  weeks.push(currentWeek);
  return weeks;
};

export const groupDataByMonth = (year: number) => {
  const Months = [];
  for (let month = 0; month < 12; month++) {
    const firstDayOfMonth = moment().year(year).month(month).startOf("month");
    const lastDayOfMonth = moment().year(year).month(month).endOf("month");
    const daysInMonth = [];
    let currentDay = firstDayOfMonth;
    let firstDayOfWeek = currentDay.day();
    while (firstDayOfWeek > 0) {
      daysInMonth.push(null);
      firstDayOfWeek--;
    }
    while (currentDay.isBefore(lastDayOfMonth) || currentDay.isSame(lastDayOfMonth, "day")) {
      daysInMonth.push(currentDay.format("YYYY-MM-DD"));
      currentDay = currentDay.add(1, "days");
    }
    Months.push(daysInMonth);
  }
  return Months;
};
export const getGithubBGcolorClassName = (value: number, maxValue: number) => {
  const percentage = (value / maxValue) * 100;
  if (percentage === 0) return "bg-muted";
  if (percentage <= 20) return "bg-green-300";
  if (percentage <= 40) return "bg-green-500";
  if (percentage <= 60) return "bg-green-700";
  if (percentage <= 80) return "bg-green-800";
  if (percentage <= 100) return "bg-green-900";
  return "bg-muted";
};
export const getPrimaryBGcolorClassName = (value: number, maxValue: number) => {
  const percentage = (value / maxValue) * 100;
  if (percentage === 0) return "bg-muted";
  if (percentage <= 20) return "bg-primary/30";
  if (percentage <= 40) return "bg-primary/50";
  if (percentage <= 60) return "bg-primary/70";
  if (percentage <= 80) return "bg-primary/80";
  if (percentage <= 100) return "bg-primary";
  return "bg-muted";
};
export const getReadingLevel = (value: number, maxValue: number) => {
  const percentage = (value / maxValue) * 100;
  if (percentage === 0) return 0;
  if (percentage <= 20) return 1;
  if (percentage <= 40) return 2;
  if (percentage <= 60) return 3;
  if (percentage <= 80) return 4;
  if (percentage <= 100) return 5;
  return 0;
};

export const getCurrentDayofYear = (currentYear: number) => {
  if (currentYear === moment().year()) {
    return moment().dayOfYear();
  } else return getDayofYear(currentYear);
};
