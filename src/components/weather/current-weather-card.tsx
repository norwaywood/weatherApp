import { CalendarDays, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { WeatherIcon } from "@/components/weather/weather-icon";
import { formatDate, weatherLabel } from "@/lib/weather";
import type { LocationResult, WeatherResponse } from "@/types/weather";

export function CurrentWeatherCard({ weather, location }: { weather: WeatherResponse; location: LocationResult }) {
  const current = weather.current;
  const daily = weather.daily;
  return (
    <Card className="relative min-h-[315px] overflow-hidden border-0 bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 text-white lg:col-span-7">
      <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/15 blur-2xl" />
      <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" />
      <CardContent className="relative flex h-full min-h-[315px] flex-col justify-between p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-white/80"><MapPin className="size-4" />{location.name}{location.admin1 ? `, ${location.admin1}` : ""}</div>
            <div className="mt-2 flex items-center gap-2 text-sm text-white/70"><CalendarDays className="size-4" />{formatDate(current.time)}</div>
          </div>
          <div className="rounded-2xl bg-white/15 p-3 backdrop-blur-md"><WeatherIcon code={current.weather_code} isDay={current.is_day === 1} className="size-12 sm:size-16" /></div>
        </div>
        <div className="mt-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-7xl font-semibold tracking-[-0.08em] sm:text-8xl">{Math.round(current.temperature_2m)}°</p>
            <p className="mt-2 text-xl font-medium">{weatherLabel(current.weather_code)}</p>
            <p className="mt-1 text-sm text-white/75">체감 {Math.round(current.apparent_temperature)}°</p>
          </div>
          <div className="pb-2 text-right text-sm text-white/80">
            <p>최고 <span className="font-semibold text-white">{Math.round(daily.temperature_2m_max[0])}°</span></p>
            <p className="mt-1">최저 <span className="font-semibold text-white">{Math.round(daily.temperature_2m_min[0])}°</span></p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

