import { CalendarRange, Droplets } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherIcon } from "@/components/weather/weather-icon";
import { formatDate, weatherLabel } from "@/lib/weather";
import type { WeatherResponse } from "@/types/weather";

export function WeeklyForecast({ weather }: { weather: WeatherResponse }) {
  const d = weather.daily;
  return (
    <Card className="lg:col-span-7">
      <CardHeader className="flex-row items-center justify-between space-y-0"><div><CardTitle>7일간 날씨</CardTitle><CardDescription>한 주의 기온과 강수 전망</CardDescription></div><CalendarRange className="size-5 text-muted-foreground" /></CardHeader>
      <CardContent>
        <div className="divide-y">
          {d.time.slice(0, 7).map((date, index) => (
            <div key={date} className="grid grid-cols-[76px_1fr_auto] items-center gap-3 py-3.5">
              <div><p className="text-sm font-medium">{index === 0 ? "오늘" : formatDate(date, { weekday: "long" })}</p><p className="text-xs text-muted-foreground">{formatDate(date, { month: "numeric", day: "numeric" })}</p></div>
              <div className="flex min-w-0 items-center gap-3"><WeatherIcon code={d.weather_code[index]} className="size-6" /><div className="min-w-0"><p className="truncate text-sm">{weatherLabel(d.weather_code[index])}</p><p className="flex items-center gap-1 text-xs text-sky-600"><Droplets className="size-3" />{d.precipitation_probability_max[index]}%</p></div></div>
              <div className="flex items-center gap-2 tabular-nums"><span className="text-sm text-muted-foreground">{Math.round(d.temperature_2m_min[index])}°</span><span className="w-8 text-right font-semibold">{Math.round(d.temperature_2m_max[index])}°</span></div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
