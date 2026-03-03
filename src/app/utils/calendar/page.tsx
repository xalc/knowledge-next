import { Calendar } from "@/components/calendar/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Holiday = {
  date: string;
  type: string;
  holidayname: string;
  highway_free: boolean;
};

const HOLIDAY_DIR = path.join(process.cwd(), "public", "holidays");
const PUBLIC_DIR = path.join(process.cwd(), "public");

function parseYear(value: string | undefined): number | null {
  if (!value) return null;
  const year = Number(value);
  if (!Number.isInteger(year) || year < 2000 || year > 2100) return null;
  return year;
}

async function getAvailableYears(): Promise<number[]> {
  const yearSet = new Set<number>();
  const scanDirs = [HOLIDAY_DIR, PUBLIC_DIR];

  for (const dir of scanDirs) {
    try {
      const files = await fs.readdir(dir);
      for (const file of files) {
        const match = file.match(/^(\d{4})\.json$/);
        if (!match) continue;
        yearSet.add(Number(match[1]));
      }
    } catch {
      // Ignore missing directories and continue scanning.
    }
  }

  return Array.from(yearSet).sort((a, b) => a - b);
}

async function readHolidayFileByYear(year: number): Promise<string> {
  const candidates = [
    path.join(HOLIDAY_DIR, `${year}.json`),
    path.join(PUBLIC_DIR, `${year}.json`),
  ];

  for (const filePath of candidates) {
    try {
      return await fs.readFile(filePath, "utf-8");
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw error;
      }
    }
  }

  throw new Error(`Holiday file ${year}.json not found in /public or /public/holidays`);
}

async function getHolidays(yearParam?: string) {
  const availableYears = await getAvailableYears();

  if (availableYears.length === 0) {
    throw new Error("No holiday JSON file found in public directory");
  }

  const currentYear = new Date().getFullYear();
  const requestedYear = parseYear(yearParam);
  const defaultYear = availableYears.includes(currentYear)
    ? currentYear
    : availableYears[availableYears.length - 1];
  const year =
    requestedYear && availableYears.includes(requestedYear) ? requestedYear : defaultYear;

  const jsonData = await readHolidayFileByYear(year);
  const holidays = JSON.parse(jsonData) as Holiday[];
  return { holidays, year, availableYears };
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string }>;
}) {
  const { year: yearParam } = await searchParams;
  const { holidays, year, availableYears } = await getHolidays(yearParam);
  const highwayFreeDays = holidays.filter(
    item => item.type === "holiday" && item.highway_free,
  ).length;
  const description = `${year}年节假日日历，含法定节假日、调休上班及高速免费信息（高速免费共${highwayFreeDays}天）。`;

  return (
    <Card className="border-0 p-0 shadow-none">
      <CardHeader className="flex space-y-4">
        <CardTitle className="self-center text-2xl">{year}年节假日日历</CardTitle>
        <p className="self-center text-sm text-muted-foreground">{description}</p>
        <div className="self-center">
          <div className="inline-flex rounded-lg border p-1">
            {availableYears.map(itemYear => (
              <Link
                key={itemYear}
                href={`/utils/calendar?year=${itemYear}`}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm transition-colors",
                  itemYear === year
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {itemYear}
              </Link>
            ))}
          </div>
        </div>
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
