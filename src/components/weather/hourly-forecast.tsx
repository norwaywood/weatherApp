import { Clock3, Droplets } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherIcon } from "@/components/weather/weather-icon";
import { formatHour, getNext24Hours } from "@/lib/weather";
import type { WeatherResponse } from "@/types/weather";

export function HourlyForecast({ weather }: { weather: WeatherResponse }) {
  const hours = getNext24Hours(weather);
  return (
    <Card className="lg:col-span-12">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div><CardTitle>앞으로 24시간</CardTitle><CardDescription>현재 시각부터 시간별 예보</CardDescription></div>
        <Clock3 className="size-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-thin">
          {hours.map((hour, index) => (
            <div key={hour.time} className={`flex min-w-[84px] flex-col items-center rounded-2xl border px-3 py-4 ${index === 0 ? "border-primary bg-primary/5" : "bg-background/55"}`}>
              <span className="text-xs font-medium text-muted-foreground">{index === 0 ? "지금" : formatHour(hour.time)}</span>
              <WeatherIcon code={hour.weatherCode} className="my-3 size-7" />
              <span className="font-semibold">{Math.round(hour.temperature)}°</span>
              <span className="mt-2 flex items-center gap-1 text-xs text-sky-600"><Droplets className="size-3" />{hour.precipitationProbability}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

