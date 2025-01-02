import { Calendar } from "@/components/calendar/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import fs from 'fs/promises';
import path from 'path'
async function getHolidays() {
  const date = new Date();
  const year = date.getFullYear();
  const filePath = path.join(process.cwd(), `public/holidays/${year}.json`);
  try {
    const jsonData = await fs.readFile(filePath, 'utf-8');
    const holidays = JSON.parse(jsonData);
    return { holidays, year };
  } catch (error) {
    throw error;
  }


}
export default async function CalendarPage() {
  const { holidays, year } = await getHolidays();
  return (

    <Card className="border-0 shadow-none">
      <CardHeader className="space-y-4 flex ">
        <CardTitle className="text-2xl self-center">2025年节假日日历</CardTitle>
        <div className="flex flex-wrap gap-4 text-sm justify-end">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-red-500 dark:text-red-400 font-medium">休</span>
              <div className="w-3 h-3 rounded-full bg-red-500 dark:bg-red-400" />
            </div>
            <span>法定节假日</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-blue-500 dark:text-blue-400 font-medium">班</span>
              <div className="w-3 h-3 rounded-full bg-blue-500 dark:bg-blue-400" />
            </div>
            <span>调整上班</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-green-500 dark:text-green-400 font-medium">免</span>
              <div className="w-3 h-3 rounded-full bg-green-500 dark:bg-green-400" />
            </div>
            <span>高速免费</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Calendar holidays={holidays} year={year} />
      </CardContent>
    </Card>

  )
}
