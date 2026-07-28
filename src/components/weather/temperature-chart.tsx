import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/weather";
import type { WeatherResponse } from "@/types/weather";

export function TemperatureChart({ weather }: { weather: WeatherResponse }) {
  const max = Math.max(...weather.daily.temperature_2m_max.slice(0, 7));
  const min = Math.min(...weather.daily.temperature_2m_min.slice(0, 7));
  const range = Math.max(max - min, 1);
  const points = weather.daily.temperature_2m_max.slice(0, 7).map((value, index) => ({
    x: 18 + index * 44,
    y: 105 - ((value - min) / range) * 68,
    value: Math.round(value),
  }));
  const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");

  return (
    <Card className="lg:col-span-5">
      <CardHeader className="flex-row items-center justify-between space-y-0"><div><CardTitle>주간 기온 흐름</CardTitle><CardDescription>일별 최고기온 변화</CardDescription></div><TrendingUp className="size-5 text-muted-foreground" /></CardHeader>
      <CardContent>
        <div className="rounded-2xl border bg-gradient-to-b from-primary/5 to-transparent p-3">
          <svg viewBox="0 0 300 130" className="h-40 w-full" role="img" aria-label="7일 최고기온 그래프">
            <path d={path} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary" />
            {points.map((point, index) => <g key={index}><circle cx={point.x} cy={point.y} r="4" fill="currentColor" className="text-primary" /><text x={point.x} y={point.y - 10} textAnchor="middle" fontSize="10" fill="currentColor">{point.value}°</text></g>)}
          </svg>
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-muted-foreground">
            {weather.daily.time.slice(0, 7).map((date, index) => <span key={date}>{index === 0 ? "오늘" : formatDate(date, { weekday: "short" })}</span>)}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-muted/60 p-4"><p className="text-xs text-muted-foreground">주간 최고</p><p className="mt-1 text-2xl font-semibold">{Math.round(max)}°</p></div>
          <div className="rounded-2xl bg-muted/60 p-4"><p className="text-xs text-muted-foreground">주간 최저</p><p className="mt-1 text-2xl font-semibold">{Math.round(min)}°</p></div>
        </div>
      </CardContent>
    </Card>
  );
}
