"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type holiday = {
  date: string;
  type: string;
  holidayname: string;
  highway_free: boolean;
};
const MONTHS = [
  "一月",
  "二月",
  "三月",
  "四月",
  "五月",
  "六月",
  "七月",
  "八月",
  "九月",
  "十月",
  "十一月",
  "十二月",
];
const WEEKS = ["日", "一", "二", "三", "四", "五", "六"];
export function Calendar({ holidays, year }) {
  const [selectedDate, setSelectedDate] = React.useState<Date>();

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const generateMonthGrid = (year: number, month: number) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    const grid = [];

    const prevMonthDays = getDaysInMonth(year, month - 1);
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      grid.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false,
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      grid.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    const remainingDays = 42 - grid.length;
    for (let i = 1; i <= remainingDays; i++) {
      grid.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }

    return grid;
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    let month: number | string = date.getMonth() + 1;
    let day: number | string = date.getDate();
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;

    return `${year}-${month}-${day}`;
  };
  const getHolidayInfo = (date: Date) => {
    return holidays.find((h: holiday) => h.date === formatDate(date));
  };

  return (
    <ScrollArea className="h-[700px] rounded-md border">
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {MONTHS.map((monthName, monthIndex) => (
          <div key={monthName} className="space-y-2">
            <h3 className="text-center font-semibold">{monthName}</h3>
            <div className="grid grid-cols-7 gap-1 text-sm">
              {WEEKS.map(day => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
              {generateMonthGrid(year, monthIndex).map(({ date, isCurrentMonth }, index) => {
                const holidayInfo = getHolidayInfo(date);
                const isSelected =
                  selectedDate && formatDate(date) === formatDate(selectedDate) && isCurrentMonth;

                return (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className={cn(
                            "relative flex flex-col items-center justify-center rounded-sm p-0.5 transition-colors hover:bg-accent",
                            !isCurrentMonth && "text-muted-foreground/50",
                            isSelected && "bg-primary hover:bg-primary",
                          )}
                          onClick={() => setSelectedDate(date)}
                        >
                          {isCurrentMonth && (
                            <time
                              dateTime={formatDate(date)}
                              className={cn(
                                "text-xs font-medium",
                                isSelected && "text-primary-foreground",
                              )}
                            >
                              {date.getDate()}
                            </time>
                          )}
                          {isCurrentMonth && holidayInfo && (
                            <div
                              className={cn(
                                "whitespace-nowrap text-[10px] leading-none",
                                isSelected && "text-primary-foreground",
                              )}
                            >
                              <span
                                className={cn(
                                  holidayInfo.type === "holiday"
                                    ? "text-red-500 dark:text-red-400"
                                    : "text-blue-500 dark:text-blue-400",
                                )}
                              >
                                {holidayInfo.type === "holiday" ? "休" : "班"}
                              </span>
                              {holidayInfo.highway_free && (
                                <>
                                  <span className="text-muted-foreground">/</span>
                                  <span className="text-green-500 dark:text-green-400">免</span>
                                </>
                              )}
                            </div>
                          )}
                        </button>
                      </TooltipTrigger>
                      {isCurrentMonth && holidayInfo && (
                        <TooltipContent>
                          <p>{holidayInfo.holidayname}</p>
                          {holidayInfo.highway_free && <p>高速公路免费通行</p>}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
