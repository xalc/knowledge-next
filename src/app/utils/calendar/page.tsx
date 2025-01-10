import { Calendar } from "@/components/calendar/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import fs from "fs/promises";
import path from "path";
async function getHolidays() {
  const date = new Date();
  const year = date.getFullYear();
  const filePath = path.join(process.cwd(), `public/holidays/${year}.json`);
  try {
    const jsonData = await fs.readFile(filePath, "utf-8");
    const holidays = JSON.parse(jsonData);
    return { holidays, year };
  } catch (error) {
    console.log("error fetching holidays", error);
    throw error;
  }
}
export default async function CalendarPage() {
  const description =
    "小型客车收费公路免费通行时间范围为春节、清明节、劳动节、国庆节4个国家法定节假日。根据国务院办公厅印发的《关于2025年部分节假日安排的通知》梳理发现，2025年共有24天，小型客车可享受高速公路免费通行政策。其中，春节8天、清明节3天、劳动节5天、国庆节8天。";

  const { holidays, year } = await getHolidays();
  return (
    <Card className="border-0 p-0 shadow-none">
      <CardHeader className="flex space-y-4">
        <title>2025年假期高速日历</title>
        <meta name="description" content={description} />
        <CardTitle className="self-center text-2xl">2025年节假日日历</CardTitle>
        <div className="flex flex-wrap justify-end gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="font-medium text-red-500 dark:text-red-400">休</span>
              <div className="h-3 w-3 rounded-full bg-red-500 dark:bg-red-400" />
            </div>
            <span>法定节假日</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="font-medium text-blue-500 dark:text-blue-400">班</span>
              <div className="h-3 w-3 rounded-full bg-blue-500 dark:bg-blue-400" />
            </div>
            <span>调整上班</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="font-medium text-green-500 dark:text-green-400">免</span>
              <div className="h-3 w-3 rounded-full bg-green-500 dark:bg-green-400" />
            </div>
            <span>高速免费</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Calendar holidays={holidays} year={year} />
      </CardContent>
    </Card>
  );
}
