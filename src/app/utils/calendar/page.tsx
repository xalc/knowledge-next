import { Calendar } from "@/components/calendar/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import fs from "fs/promises";
import path from "path";

async function getHolidays() {
  try {
    const currentYear = new Date().getFullYear();
    const holidaysDir = path.join(process.cwd(), "public/holidays");
    const files = await fs.readdir(holidaysDir);
    const availableYears = files
      .map(file => Number(file.replace(".json", "")))
      .filter(year => Number.isInteger(year))
      .sort((a, b) => b - a);

    if (availableYears.length === 0) {
      return { holidays: [], year: currentYear };
    }

    const selectedYear = availableYears.includes(currentYear) ? currentYear : availableYears[0];
    const filePath = path.join(holidaysDir, `${selectedYear}.json`);
    const jsonData = await fs.readFile(filePath, "utf-8");
    const holidays = JSON.parse(jsonData);
    return { holidays, year: selectedYear };
  } catch (error) {
    console.log("error fetching holidays", error);
    return { holidays: [], year: new Date().getFullYear() };
  }
}
export default async function CalendarPage() {
  const description =
    "小型客车收费公路免费通行时间范围为春节、清明节、劳动节、国庆节4个国家法定节假日。";

  const { holidays, year } = await getHolidays();
  return (
    <Card className="border-0 p-0 shadow-none">
      <CardHeader className="flex space-y-4">
        <title>{year}年假期高速日历</title>
        <meta name="description" content={description} />
        <CardTitle className="self-center text-2xl">{year}年节假日日历</CardTitle>
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
